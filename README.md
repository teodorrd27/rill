# Trumpet Technical Challenge - Real-time Collaborative Text Widgets

## Overview
This application enables users to add, edit, and manage independent text widgets with real-time persistence. Built using a CRDT (Conflict-free Replicated Data Type) architecture with YJS to efficiently handle concurrent editing and data synchronization.

## Key Features
- Create multiple independent text widgets
- Real-time data persistence via WebSockets
- Efficient handling of large text inputs (1000+ characters)
- Automatic synchronization between clients
- Widget deletion functionality

## Technical Architecture
The application utilizes a CRDT-based architecture with YJS to optimize data transmission:

- **Efficient Data Synchronization**: Unlike traditional approaches that send entire widget content on each update, our implementation transmits only the minimal changes needed.
- **WebSocket Transport**: Provides low-latency, bidirectional communication between clients and server.
- **Optimized for Large Text**: Specifically designed to handle substantial text content without performance degradation.
- **TipTap Editor**: Leveraging TipTap as the text editor component, providing a clean and customizable editing experience that integrates seamlessly with YJS.

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/trumpet-challenge.git
cd trumpet-challenge

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Running Tests
```bash
npm test
```

## Docker Support
The application can be run in a Docker container:

```bash
# Build the Docker image
docker build -t trumpet-widget .

# Run the container
docker run -p 3000:3000 trumpet-widget
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

## Important Caveats

**Please Note:**
- While the solution fully supports real-time collaboration between multiple users, the delete functionality **does not work yet in a collaborative setting**.
- Due to the underlying data structure, sometimes the widgets might be reloaded out of sequence after a page refresh or reconnection.

These issues are known limitations of the current implementation and would be addressed in future iterations of the application.

## Future Improvements
With additional time, I would consider:

- Adding rich text formatting capabilities 
- Implementing user presence indicators
- Adding widget reordering functionality
- Enhancing offline support with better conflict resolution
- Improving accessibility features

## Testing Strategy
The application includes:
- Unit tests for component functionality
- Integration tests for data synchronization
- Performance tests for handling large text inputs

## License
MIT
