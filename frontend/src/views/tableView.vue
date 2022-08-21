<template>
  <table>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Age</th>
      <th>Date of Birth</th>
      <th>favourite Artist</th>
      <th>Newsletter Signup</th>
      <th>Input errors</th>
    </tr>
    <tr v-for="line in lines">
      <td>{{ line.name }}</td>
      <td>{{ line.email }}</td>
      <td>{{ line.age }}</td>
      <td>{{ line.dob }}</td>
      <td>{{ line.favouriteArtist }}</td>
      <td>{{ line.newsletterSignup }}</td>
      <td>
        <div v-for="error in line.errors">
          * {{ error }}
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'fetch',
    data() {
      return {
        lines: [],
      }
    },
    methods: {
      getLines() {
        axios.get('https://l44i37bjmj.execute-api.eu-west-2.amazonaws.com/DBReadLambda')
          .then((response) => {
            console.log(response.data.Items);
            this.lines = response.data.Items;
          }).catch(error => console.log(error));
      }
    },
    beforeMount() {
      this.getLines();
    }
  }
</script>

<style scoped>
  table {
    width: 100%;
  }
  table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
  }
  table th {
    font-weight: bold;
  }
  table th, td {
    padding: 20px;
  }
</style>
