<template>
  <div class ="p-4 mt-20">
    <h2>User Agent Upload</h2>

    <form @submit.prevent="uploadUser">
      <input type="text" v-model="firstname" placeholder="First Name" required />
      <input type="text" v-model="lastname" placeholder="Last Name" required />
      <input type="file" @change="handleFileUpload" accept="image/*" required />
      <button type="submit">Upload</button>
    </form>

    <h2>All User Agents</h2>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Photo</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <td>{{ index + 1 }}</td>
          <td>{{ user.firstname }}</td>
          <td>{{ user.lastname }}</td>
          <td>
            <img v-if="user.photoUrl" :src="`http://localhost:5000${user.photoUrl}`" width="50" />
          </td>
          <td>
            <button @click="editUser(user)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="editingUser" class="edit-form">
      <h3>Edit User</h3>
      <form @submit.prevent="updateUser">
        <input type="text" v-model="editFirstname" placeholder="First Name" required />
        <input type="text" v-model="editLastname" placeholder="Last Name" required />
        <input type="file" @change="handleEditFileUpload" accept="image/*" />
        <button type="submit">Update</button>
        <button type="button" @click="cancelEdit">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstname: "",
      lastname: "",
      photo: null,
      users: [],
      editingUser: null,
      editFirstname: "",
      editLastname: "",
      editPhoto: null,
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    handleFileUpload(event) {
      this.photo = event.target.files[0];
    },
    handleEditFileUpload(event) {
      this.editPhoto = event.target.files[0];
    },
    async uploadUser() {
      const formData = new FormData();
      formData.append("firstname", this.firstname);
      formData.append("lastname", this.lastname);
      formData.append("photo", this.photo);

      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        this.users.push(data.user);
      } catch (error) {
        console.error("Upload error:", error);
      }
    },
    async fetchUsers() {
      try {
        const response = await fetch("http://localhost:5000/users");
        this.users = await response.json();
      } catch (error) {
        console.error("Fetch users error:", error);
      }
    },
    editUser(user) {
      this.editingUser = user;
      this.editFirstname = user.firstname;
      this.editLastname = user.lastname;
    },
    async updateUser() {
      const formData = new FormData();
      formData.append("firstname", this.editFirstname);
      formData.append("lastname", this.editLastname);
      if (this.editPhoto) {
        formData.append("photo", this.editPhoto);
      }

      try {
        const response = await fetch(`http://localhost:5000/users/${this.editingUser.id}`, {
          method: "PUT",
          body: formData,
        });
        const data = await response.json();

        // Update the local users array
        const index = this.users.findIndex((u) => u.id === this.editingUser.id);
        if (index !== -1) {
          this.users[index] = data.user;
        }

        this.cancelEdit();
      } catch (error) {
        console.error("Update error:", error);
      }
    },
    cancelEdit() {
      this.editingUser = null;
      this.editFirstname = "";
      this.editLastname = "";
      this.editPhoto = null;
    },
  },
};
</script>

<style>
.edit-form {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  background: #f9f9f9;
}
</style>
