<template>
  <div class="container">
      <div class="form-container">
        <h1>Voer uw naam in:</h1>
        <form @submit.prevent="handleSubmit">
            <label for="firstName">Voornaam:</label>
            <input v-model.lazy="firstName" placeholder="Jan" required/>

            <label for="lastName">Achternaam:</label>
            <input v-model.lazy="lastName" placeholder="Visser" required>

            <button type="submit" @click="handleSubmit">Doorgaan</button>
        </form>
    </div>
  </div>
</template>

<script>
// import { createConnection } from '../utils/socket';

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
    };
  },
  methods: {
    handleSubmit() {
      if (this.firstName && this.lastName) {
        // const socket = createConnection();
        
        this.$router.push({
          name: 'homepage',
          params: { firstName: this.firstName, lastName: this.lastName }
        });
      } else {
        alert("Please fill in both your first and last names.");
      }
    },
  },
};
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: radial-gradient(50% 50% at 50% 50%, rgb(80, 140, 155) 0%, rgb(19, 75, 112) 100%);
    font-family: 'Helvetica', 'Arial', sans-serif;
  }

  .container h1, .container label {
    color: #EEEEEE;
  }

  .form-container {
    padding: 20px;
    border-radius: 10px;
    width: 20%;
}

  h1 {
    text-align: center;
    margin-bottom: 150px;
  }

  label {
    text-align: left;
    font-weight: bold;
    display: block;
    margin-bottom: 5px;

  }

  form{
    text-align: center;
  }

  input, textarea {
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 16px;
  }

  textarea {
      resize: vertical;
  }

  button {
    margin: 20px;
    background-color: #2a93ad;
    color: #EEEEEE;
    border: 2px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
}

  button:hover {
    background-color: #095466;
  }


</style>
