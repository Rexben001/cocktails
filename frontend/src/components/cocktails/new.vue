<template>
  <div id="cocktail-form">
    <h1>Add a New Cocktail</h1>
    <div v--if="form.error" id="error">{{ form.error }}</div>

    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-group">
        <label for="title">Title:</label>
        <input type="text" v-model="form.title" id="title" required class="form-input"
          placeholder="Enter cocktail title" />
      </div>
      <div class="form-group">
        <label for="price">Price:</label>
        <input type="number" v-model="form.price" id="price" required class="form-input" placeholder="Enter cocktail price" />
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea v-model="form.description" id="description" required class="form-textarea"
          placeholder="Describe the cocktail..."></textarea>
      </div>
      <button type="submit" class="submit-button">Submit</button>
    </form>
  </div>
</template>

<script>

export default {
  name: 'AddCocktail',
  data() {
    return {
      form: {
        title: '',
        price: '',
        description: '',
        error: ''
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch(
          'http://localhost:3000/cocktails',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.form),
          },
        );

        if (!response.ok) {
          const text = await response.text();


          throw new Error(JSON.parse(text).message);
        }

        const data = await response.json();

        console.log('Form submitted successfully:', data);
        // Clear the form
        this.form.title = '';
        this.form.price = '';
        this.form.description = '';
      } catch (error) {
        console.error('There was an error submitting the form:', error);

        this.form.error = error.message

      }
    },
  },
};
</script>

<style scoped>
#cocktail-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #3498db;
  text-align: center;
}

.form-container {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #3498db;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #2980b9;
  outline: none;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.submit-button {
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.submit-button:hover {
  background-color: #2980b9;
}

#error {
  color: #e74c3c;
  margin: 10px 0;
}
</style>
