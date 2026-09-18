Dagoba = {} // The namespace

Dagoba.G = {} // The prototype

Dagoba.graph = function(V, E) { // The factory
    var graph = Object.create(Dagoba.G)
    
    graph.edges = []
    graph.vertices = []
    graph.vertexIndex = {} // Lookup optimisation

    graph.autoid = 1 // Auto-incrementing ID counter

    if(Array.isArray(V)) graph.addVertices(V) // Check types of V and E 
    if(Array.isArray(E)) graph.addEdges(E)

    return graph
}

Dagoba.G.addVertices = function(vs) {vs.forEach(this.addVertex.bind(this))}
Dagoba.G.addEdges = function(es) {es.forEach(this.addEdges.bind(this))}

Dagoba.G.addVertex = function(vertex) {
    if(!vertex._id)
        vertex._id = this.autoid++ // Assign this vertex an ID if it doesn't have one
    else if(this.findVertexById(vertex._id))
        return Dagoba.error('A vertex with that ID already exists')

    this.vertices.push(vertex)
    this.vertexIndex[vertex._id] = vertex // Indexing
    vertex._out = []; vertex._in = [] // placeholders for edge pointers
    return vertex._id
}

Dagoba.G.addEdge = function(edge) {
    edge._in = this.findVertexById(edge._in) // Lookup IDs for vertices
    edge._out = this.findVertexById(edge._out) 

    if(!(edge._in && edge._out))
        return Dagoba.error("That edge's " + (edge._in ? 'out' : 'in') + "vertex wasn't found")

    this.edges.push(edge) // Edge lives in this graph's edges
    edge._out._out.push(edge) // Edge lives in outer vertex's outer edges
    edge._in._in.push(edge) // Edge lives in inner vertex's inner edges
}

Dagoba.error = function(msg) {
    console.log(msg)
    return false
}

Dagoba.Q = {}

Dagoba.query = function (graph) {
    var query = Object.create(Dagoba.Q)
    query.graph = graph
    query.state = []
    query.program = []
    query.gremlins = []

    return query
}
