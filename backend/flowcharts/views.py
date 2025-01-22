from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Flowchart, Node, Edge
from .serializers import FlowchartSerializer, NodeSerializer, EdgeSerializer

class FlowchartViewSet(viewsets.ModelViewSet):
    queryset = Flowchart.objects.all()
    serializer_class = FlowchartSerializer

    @action(detail=True, methods=['get'])
    def validate_graph(self, request, pk=None):
        flowchart = self.get_object()
        nodes = list(flowchart.nodes.all())
        edges = list(flowchart.edges.all())

        # Example: Simple validation to check if all edges have valid nodes
        invalid_edges = []
        for edge in edges:
            if edge.source not in nodes or edge.target not in nodes:
                invalid_edges.append(edge.id)

        if invalid_edges:
            return Response({"message": "Invalid graph: some edges have invalid nodes.", "invalid_edges": invalid_edges}, status=400)

        return Response({"message": "Graph is valid."})

    @action(detail=True, methods=['get'])
    def outgoing_edges(self, request, pk=None):
        node_id = request.query_params.get("node_id")
        if not node_id:
            return Response({"error": "node_id query parameter is required."}, status=400)

        edges = Edge.objects.filter(source_id=node_id, flowchart_id=pk)
        return Response(EdgeSerializer(edges, many=True).data)

    @action(detail=True, methods=['get'])
    def connected_nodes(self, request, pk=None):
        node_id = request.query_params.get("node_id")
        if not node_id:
            return Response({"error": "node_id query parameter is required."}, status=400)

        visited = set()

        def dfs(node):
            visited.add(node.id)
            for edge in node.outgoing_edges.all():
                if edge.target.id not in visited:
                    dfs(edge.target)

        try:
            start_node = Node.objects.get(id=node_id, flowchart_id=pk)
            dfs(start_node)
        except Node.DoesNotExist:
            return Response({"error": "Node not found."}, status=404)

        connected_nodes = Node.objects.filter(id__in=visited)
        return Response(NodeSerializer(connected_nodes, many=True).data)