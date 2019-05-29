import React, {Component } from 'react';


class Login extends Component{

	constructor(props){
		super(props);
		this.state = {
            email:"",
            password:""
        }
        this.handleClick = this.handleClick.bind(this);

	}

    handleClick(event) {
		fetch("http://me-do.cl/backend/api/administrators/login?[include]=user",
			{
			    method: "POST",
			    body: JSON.stringify(this.state),
			     headers:{
				    'Content-Type': 'application/json'
				  }
			}
		)
        .then(response => response.json())
		.then(parsedJson => {
            console.log(parsedJson['id']);
			if(parsedJson['id']){
                console.log("logeado",parsedJson);
				var data={
					"token":parsedJson['id'],
					"user":parsedJson['user']
				}
				sessionStorage.setItem('getData', JSON.stringify(data)); 
                
                
				this.props.history.push('text/Home');
			}else{
				console.log("no logeado?");
				alert("Los datos ingresados no son validos");


			}
			

			} 
		)
		.catch(error => alert('Error al intentar conectar con el servidor.', 1500, 'red') ); 
		console.log("asd");
    }
    

	render(){

		return(
				
            <div style={{'width': '400px',
                'margin': '100px auto'}}>
                <form action="">
                    <h2 className="text-center"> Inicio de Sesión <br/> <br/> </h2>       
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="E-mail" required="required"
                        onChange = {(event) => {
                            this.setState({'email':event.target.value });
                        }}  />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" placeholder="Contraseña" required="required" 
                         onChange = {(event) => {
                            this.setState({'password':event.target.value });
                        }}     />
                    </div>
                    
   
                </form>
                <div>
                        <button onClick={this.handleClick} className="btn btn-success btn-block"> Iniciar Sesión</button>
                    </div>
            </div>
		)



	}

}


export default Login;