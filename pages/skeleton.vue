<template>
  <div class="container">
    <div class="bucket-list">
      <!-- Loop through the new_bucket array and print each item -->
      <div v-for="(bucket, index) in new_bucket" :key="index" class="bucket-item">
        <h3>{{ bucket.title }}</h3>
        <!-- <p><strong>One-liner:</strong> {{ bucket.one_liner }}</p>
        <p><strong>Description:</strong> {{ bucket.description }}</p> -->
        <p><strong>Mu:</strong> {{ bucket.mu }}</p>
        <p><strong>Sigma:</strong> {{ bucket.sigma }}</p>
        <p><strong>Swarm Score:</strong> {{ bucket.swarm_score }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getSocket } from '../utils/socket';

export default {
  data() {
    return {
      socket: null,
      new_bucket: [], // To store the received data
    };
  },
  mounted() {
    this.socket = getSocket();

    // Emit the 'get-new-bucket' event to request data from the server
    this.socket.emit('get-new-bucket');

    // Listen for the 'new-bucket-data' event and update the new_bucket array
    this.socket.on('new-bucket-data', (data) => {
      this.new_bucket = data;
    });
  },
  beforeDestroy() {
    // Clean up socket connection when the component is destroyed
    if (this.socket) {
      this.socket.off('new-bucket-data');
    }
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: aqua;
}

.bucket-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 60%;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.bucket-item {
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}

.bucket-item h3 {
  margin-bottom: 5px;
}

.bucket-item p {
  margin: 2px 0;
}
</style>
