// Simple test client using EventSource directly
const EventSource = require('eventsource').default || require('eventsource');

async function main() {
  console.log('Starting test client...');
  
  const eventSource = new EventSource('http://localhost:3001/trpc?procedure=countdown');
  
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Received:', data);
      
      if (event.data === '[DONE]') {
        console.log('Stream completed');
        eventSource.close();
      }
    } catch (error) {
      console.log('Raw data:', event.data);
    }
  };
  
  eventSource.onerror = (error) => {
    console.error('EventSource error:', error);
    eventSource.close();
  };
  
  // Keep the connection open for a while
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  eventSource.close();
  console.log('Client closed');
}

main().catch(console.error);