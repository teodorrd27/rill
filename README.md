# Trumpet Technical Challenge - Real-time Collaborative Text Widgets

## Overview
I took a slightly non-standard approach to the problem. Usually REST APIs would be the classical approach. I only used REST APIs as a way to serve the static page when deployed to production as well as for the /heatlh and /whosconnected endpoint. The latter is a way to check which websockets are connected to the server for collaborative purposes (see desired future work below).

This application enables users to add, edit, and manage independent text widgets with real-time persistence. Built using a CRDT (Conflict-free Replicated Data Type) architecture with YJS to efficiently handle concurrent editing and data synchronization.

## Key Features
- Create multiple independent text widgets
- Real-time data persistence via WebSockets (Caveat: sometimes on reload they will be out of the original order as I have not implemented an ordering system yet. YJS keys do not guarantee order)
- Efficient handling of large text inputs (1000+ characters)
- Automatic synchronization between clients
- Widget deletion functionality
- (WIP - half working but deletion is broken) - Real time collaborative updates when loading Rill in two or more browsers at the same.

## Technical Architecture
The application utilizes a CRDT-based architecture with YJS to optimize data transmission:

- **Efficient Data Synchronization**: Unlike traditional approaches that send entire widget content on each update, our implementation transmits only the minimal changes needed.
- **WebSocket Transport**: Provides low-latency, bidirectional communication between clients and server.
- **Optimized for Large Text**: Specifically designed to handle substantial text content without performance degradation.
- **TipTap Editor**: Leveraging TipTap as the text editor component, providing a clean and customizable editing experience that integrates seamlessly with YJS.

## Getting Started

### Prerequisites
- bun runtime or docker
- bun (if you don't have it, should be pretty easy on *nix: `curl -fsSL https://bun.sh/install | bash`)

### Installation
```bash
# Clone the repository
git clone git@github.com:teodorrd27/rill.git

# Install dependencies
bun setup

# Run Preview (build should automatically run prior to the server) - Accessible on http://localhost:4173
bun start

# Run Dev - Accessible on http://localhost:5173
bun dev

```

### Running Tests
```bash
bun test
```

## Docker Support
The application can be run in a Docker container:

```bash
# Build the Docker image
bun docker:build

# Run the container - when you hit ctrl+c, container will be stopped and removed
bun docker:start
```

## Technical Decisions and Trade-offs

### Why CRDT with YJS?
After analyzing the Trumpet widget data flow, I noticed that the entire widget content is sent after each editing pause. For large text inputs, this approach could lead to bandwidth issues and potential performance degradation. 

The CRDT approach with YJS allows us to:
1. Send only delta changes instead of entire content
2. Handle concurrent edits seamlessly
3. Maintain consistency across clients with minimal data transfer

### Trade-offs:
- **Increased Complexity**: The CRDT implementation adds some complexity compared to simpler state management solutions.
- **Initial Load**: The initial setup of YJS providers has a small performance cost on first load.
- **Session Management**: WebSocket authentication (via protocol with JWTs) is a little more cumbersome than readily available solutions.

## Important Caveats

**Please Note:**
- While the solution fully supports real-time collaboration between multiple users, the delete functionality **does not work yet in a collaborative setting**.
- Due to the underlying data structure, sometimes the widgets might be reloaded out of sequence after a page refresh or reconnection.

These issues are known limitations of the current implementation and would be addressed in future iterations of the application.

## Future Improvements
With additional time, I would consider:

- Implementing user presence indicators
- Adding widget reordering functionality
- Enhancing offline support with better conflict resolution
- Improving accessibility features
- Improve the testing suite to include integration tests and API tests

## Testing Strategy
The application includes unit tests for function level code.

## License
MIT
