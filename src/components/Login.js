import React, {Component } from 'react';
import SweetAlert from "react-bootstrap-sweetalert";

class Login extends Component{

	constructor(props){
		super(props);
		this.state = {
            email:"",
            password:"",
            showInvalid:false, showError:false
        }
        this.handleClick = this.handleClick.bind(this);
        this.hideAlert = this.hideAlert.bind(this);

	}

    handleClick(event) {
    //fetch("http://me-do.cl/backend/api/administrators/login?[include]=user",
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
				this.setState({showInvalid:true});


			}
			

			} 
		)
		.catch(error => 	this.setState({showError:true}) ); 
		console.log("asd");
    }

    
    hideAlert(){
        this.setState({showInvalid:false,showError:false});
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

                    
                    {/* Sweet Invalid */}
                    <SweetAlert 
                        show={this.state.showInvalid } 
                        warning
                        title="Datos Invalidos." 
                        onConfirm={this.hideAlert} 
                        closeOnClickOutside={true}>
							Los datos ingresados no son validos.
                    </SweetAlert>

                     {/* Sweet alert error */}
                     <SweetAlert 
                     show={this.state.showError } 
                     danger 
                     title="A ocurrido un error :(" 
                     onConfirm={this.hideAlert} 
                     closeOnClickOutside={true}>
                          </SweetAlert>
            </div>

            



		)



	}

}


export default Login;