<template>
    <div class="container">
        <form @submit.prevent="submitForm" enctype="multipart/form-data">
            <h1>Submit POI</h1>
            <div class="form-container">
            <label for="file">Upload Excel File</label>
            <input type="file" id="file" @change="handleFileUpload" accept=".xlsx, .xls" required />

            <button type="submit">Submit</button>
            <button type="button" class="cancel-button" @click="goToHomepage">Cancel</button>
            </div>
        </form>
    </div>
  </template>  

  <script>
  import { getSocket } from '../utils/socket';
  // import XLSX from 'xlsx';
  import * as XLSX from 'xlsx';

  export default {
    data() {
      return {
        title: "",
        one_liner: "",
        description: "",
        firstName: "",
        lastName: ""
      };
    },
    computed: {
      
    },
    methods: {
      // Function to handle form submission
      // submitForm() {
      //   const formData = {
      //     title: this.title,
      //     one_liner: this.one_liner,
      //     description: this.description
      //   };

      //   // Emit the form data to the server
      //   this.socket.emit('add-poi', formData, (response) => {
      //     console.log('Server response:', response);
      //     alert('Information added.');
      //     this.$router.push({
      //       name: 'homepage',
      //       params: { firstName: this.firstName, lastName: this.lastName }
      //     });  
      //   });
      // },
      handleFileUpload(event) {
        this.file = event.target.files[0];
      },
      submitForm() {
        if (this.file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Process the JSON data
            const formData = json.slice(1).map(row => ({
              title: row[0],
              one_liner: row[1],
              description: row[2]
            }));
            
            // send as a data object
            this.socket.emit('add-pois', formData, (response) => {
              console.log('Server response:', response.status);
              alert('Information added.');
              this.$router.push({
                name: 'homepage',
                params: { firstName: this.firstName, lastName: this.lastName }
              });  
            });
            // emit the form data to the server as array and then process and add it in the server
            
          };
          reader.readAsArrayBuffer(this.file);
        }
      },

      goToHomepage(){
        this.$router.push({
          name: 'homepage',
          params: { firstName: this.firstName, lastName: this.lastName }
        });  
      }
    },
    mounted() {
      this.socket = getSocket();
      this.firstName = this.$route.params.firstName;
      this.lastName = this.$route.params.lastName;
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
    font-family: 'Helvetica', sans-serif;
    /* background-color: aqua; */
  }

  .container h1, .container label {
    color: #EEEEEE;
  }

  .form-container {
    padding: 20px;
    border-radius: 10px;
    width: 40%;
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
      margin-bottom: 35px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 16px;

  }

  textarea {
      resize: vertical;
  }

  textarea::placeholder, input::placeholder {
    font-family: 'Helvetica', sans-serif;
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

  .cancel-button {  
    background-color: #dc3545;
  }

  .cancel-button:hover {
    background-color: #c82333;
  }
  </style>
  