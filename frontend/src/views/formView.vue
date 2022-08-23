<template>
  <form @submit.prevent="store">
    <div>
      <label for="userId">Name</label>
      <input type="text" id="name" v-model="formData.name" />
    </div>
    <div>
      <label for="email">Email</label>
      <input type="email" id="email" v-model="formData.email" />
    </div>
    <div>
      <label for="age">Age</label>
      <input type="number" id="age" v-model="formData.age" />
    </div>
    <div>
      <label for="dob">Date of Birth</label>
      <input type="date" id="dob" v-model="formData.dob" />
    </div>
    <div>
      <label for="favouriteArtist">Who is your favourite artist?</label>
      <input type="text" id="favouriteArtist" v-model="formData.favouriteArtist" />
    </div>
    <div>
      <label for="newsletterSignup">Do you want to sign up for our newsletter?</label>
      <input type="checkbox" id="newsletterSignup" v-model="formData.newsletterSignup" />
    </div>
    <button>Save</button>
  </form>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'store',
    data() {
      return {
        formData: {
          name: '',
          email: '',
          age: '',
          dob: '',
          favouriteArtist: '',
          newsletterSignup: false,
        }
      }
    },
    methods: {
      store() {
        if(this.hasData()) {
          axios.post('https://l44i37bjmj.execute-api.eu-west-2.amazonaws.com/DBWriteLambda', this.formData)
            .then((response) => {
              console.log(response)
              this.$router.push('/table');
            }).catch((error) => {
              console.log(error);
              alert('A error occurred, check the console!');
            });
        } else {
          alert("Please fill in at least 1 field!");
        }
      },
      hasData() {
        if(this.formData.name.length || this.formData.email.length || this.formData.favouriteArtist.length || this.formData.age || this.formData.dob) {
          return true;
        }
        return false;
      }
    }
  }
</script>

<style scoped>
  form {
    width: 40%;
    margin: auto;
    text-align: center;
  }
  form div {
    display: grid;
  }
  form label {
    font-weight: bold;
  }
  form button {
    font-weight: bold;
    font-size: 25px;
    width: 80px;
    margin-top: 20px;
  }
  form input {
    height: 30px;
  }
</style>
