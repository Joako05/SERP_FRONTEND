import { Component } from "react";
import { Link, useLocation } from "wouter";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      correo: "",
      contraseña: "",
    };
  }

  actualizarDato = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  iniciarSesion = (e) => {
    e.preventDefault();

    // acá luego llamamos al backend con axios
    console.log("Iniciar sesión:", this.state);
  };

  render() {
    return (
      <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-3">Iniciar sesión</h3>

        <form onSubmit={this.iniciarSesion}>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Correo"
            name="correo"
            value={this.state.correo}
            onChange={this.actualizarDato}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Contraseña"
            name="contraseña"
            value={this.state.contraseña}
            onChange={this.actualizarDato}
          />

          <button className="btn btn-primary w-100">Ingresar</button>
        </form>
      </div>
    );
  }
}

export default Login;
