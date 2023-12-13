<template>
  <v-container class="error-page">
    <v-row class="logo-wrapper"></v-row>
    <v-row class="d-flex justify-center">
      <v-col cols="8">
        <div class="card">
          <span class="error-logo">
            <v-img src="@/assets/error.png" width="250"></v-img>
          </span>
          <p class="error-text">Algo no salió como esperábamos.</p>
          <p class="error-subtext">
            Aún no tienes empresas asignadas. Contacta a soporte.
          </p>
          <v-btn class="text-capitalize" dark x-large to="/login">
            Regresar
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.error-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;

  .card {
    padding: 0 50px;
    background-color: #2196f3;
    border-radius: 4px;
    height: 680px;

    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;

    .error-logo {
      color: white;
      font-size: 148px;
      font-weight: 600;
    }

    .error-text {
      color: white;
      text-align: center;
      font-size: 1.64rem;
    }

    .error-subtext {
      text-align: center;
      color: white;
      font-size: 1.5rem;
    }
  }
}
</style>
