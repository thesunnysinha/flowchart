from django.db import models

class Flowchart(models.Model):
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class Node(models.Model):
    flowchart = models.ForeignKey(Flowchart, on_delete=models.CASCADE, related_name="nodes")
    name = models.CharField(max_length=100)

class Edge(models.Model):
    flowchart = models.ForeignKey(Flowchart, on_delete=models.CASCADE, related_name="edges")
    source = models.ForeignKey(Node, on_delete=models.CASCADE, related_name="outgoing_edges")
    target = models.ForeignKey(Node, on_delete=models.CASCADE, related_name="incoming_edges")