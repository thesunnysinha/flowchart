from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Flowchart
from .serializers import FlowchartSerializer

class FlowchartViewSet(viewsets.ModelViewSet):
    queryset = Flowchart.objects.all()
    serializer_class = FlowchartSerializer

    @action(detail=True, methods=['get'])
    def validate_graph(self, request, pk=None):
        flowchart = self.get_object()
        nodes = flowchart.data.get('nodes', [])
        edges = flowchart.data.get('edges', [])

        # Validate that all edges refer to valid nodes
        node_ids = {node['id'] for node in nodes}
        invalid_edges = [
            edge for edge in edges
            if edge['source'] not in node_ids or edge['target'] not in node_ids
        ]

        if invalid_edges:
            return Response(
                {"message": "Invalid graph: some edges have invalid nodes.", "invalid_edges": invalid_edges},
                status=400
            )

        return Response({"message": "Graph is valid."})

    @action(detail=True, methods=['get'])
    def outgoing_edges(self, request, pk=None):
        node_id = request.query_params.get("node_id")
        if not node_id:
            return Response({"error": "node_id query parameter is required."}, status=400)

        flowchart = self.get_object()
        edges = flowchart.data.get('edges', [])
        outgoing_edges = [
            edge for edge in edges if edge['source'] == node_id
        ]

        return Response(outgoing_edges)

    @action(detail=True, methods=['get'])
    def connected_nodes(self, request, pk=None):
        node_id = request.query_params.get("node_id")
        if not node_id:
            return Response({"error": "node_id query parameter is required."}, status=400)

        flowchart = self.get_object()
        nodes = {node['id']: node for node in flowchart.data.get('nodes', [])}
        edges = flowchart.data.get('edges', [])

        if node_id not in nodes:
            return Response({"error": "Node not found."}, status=404)

        visited = set()

        def dfs(current_id):
            if current_id not in visited:
                visited.add(current_id)
                for edge in edges:
                    if edge['source'] == current_id and edge['target'] not in visited:
                        dfs(edge['target'])

        dfs(node_id)
        connected_nodes = [nodes[n_id] for n_id in visited if n_id in nodes]

        return Response(connected_nodes)

    def update(self, request, *args, **kwargs):
        """
        Override the update method to allow only updating the title of the flowchart.
        """
        flowchart = self.get_object()

        # Only allow title to be updated, not the nodes or edges
        title = request.data.get('title', flowchart.title)

        # Update only the title field
        flowchart.title = title

        # Save the updated flowchart
        flowchart.save()

        # Serialize the updated flowchart and return the response
        serializer = self.get_serializer(flowchart)
        return Response(serializer.data)
