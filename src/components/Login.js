import React, {Component } from 'react';
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import {Spinner} from 'react-bootstrap'; 


class Login extends Component{


    componentDidMount(){
        var data = JSON.parse(sessionStorage.getItem('getData')); 
        if(data){
            axios.get("http://me-do.cl/backend/api/administrators/"+ data['user']['id'] + "?access_token=" + data['token']).then(parsedJson=> {
                console.log("AQUI ",parsedJson);
                this.props.history.push('Home');
            }).catch(function(error){
                console.log("ERROR 1 ",error);
                console.log("ERROR 1",error.response);
                console.log("ERROR 1",error.request);
                this.setState({load:false});
            });

		}else{
            this.setState({load:false});
        }
        //data.id = 
	}


	constructor(props){
		super(props);
		this.state = {
            email:"",
            password:"",
            showInvalid:false, showError:false,load:true
        }
        this.handleClick = this.handleClick.bind(this);
        this.hideAlert = this.hideAlert.bind(this);

	}

    handleClick(event) {
    //fetch("http://me-do.cl/backend/api/administrators/login?[include]=user",

        var data = {email:this.state.email,password:this.state.password};
        console.log("DATA: ",data);
        axios.post("http://me-do.cl/backend/api/administrators/login?[include]=user", data).then(parsedJson=> {
            console.log("aqui ",parsedJson);
            if(parsedJson['data']['id']){
                console.log("logeado",parsedJson['data']['id']);
				var data={
					"token":parsedJson.data['id'],
					"user":parsedJson.data['user']
				}
                sessionStorage.setItem('getData', JSON.stringify(data)); 
				this.props.history.push('Home');
			}else{
				console.log("no logeado?");
				this.setState({showInvalid:true});
			}

        }).catch(function(error){
            console.log("ERROR 1 ",error);
            console.log("ERROR 1",error.response);
            console.log("ERROR 1",error.request);
        });
    }

    
    hideAlert(){
        this.setState({showInvalid:false,showError:false});
    }

    

	render(){

        if(this.state.load){
			return( <center> <h1>  <br/> <br/><br/> </h1> <Spinner style={{'width': '6rem','height': '6rem'}} animation="border" variant="primary" /> </center> )

		}else{

            return(
                <div style={{'width': '400px',
                    'margin': '100px auto'}}>
                    <form action="">
                        <h2 className="text-center"> Inicio de Sesión ME-DO <br/> <br/> </h2>       
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

}


export default Login;