<template>
  <div id="app">
    <nav>
      <ul>
        <li><router-link to="/">Cocktails</router-link></li>
        <li class="c">
          <router-link to="/new">
            Add Cocktail
          </router-link>
        </li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  color: #333;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

nav {
  background-color: #3498db;
  padding: 10px 20px;
}

nav ul {
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav li {
  margin-right: 20px;
}

nav li a {
  text-decoration: none;
  color: white;
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 5px;
}

nav li a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.add-cocktail {
  display: flex;
  align-items: center;
}
</style>
