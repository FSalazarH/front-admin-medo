import React, {Component } from 'react';
import {Spinner, Breadcrumb ,Container,Table, Card, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import SweetAlert from "react-bootstrap-sweetalert";

class Image extends Component{
	componentDidMount(){

	}

	constructor(props){
		super(props);
		this.state = {
            image:null,
			name:"...",
			getUrl: this.props.getUrl,
			uploadUrl: this.props.uploadUrl,
			showInvalid:false,showConfirm:false,showError:false,showNotImage:false
		}
		this.handleChange = this.handleChange.bind(this);
		this.hideAlert =this.hideAlert.bind(this);
		this.fileUploadHandler = this.fileUploadHandler.bind(this);

	}

	handleChange = event => {
		var name = event.target.files[0].name;
		var type= name.split('.')[1];
		if(type == 'jpg' || type == 'png'){
			this.setState({
				file:event.target.files[0],
				name: name
			});
		}else{
			this.setState({showInvalid:true});
		}
	}

	fileUploadHandler = ()=>{
		if(this.state.file){
			console.log("Uploading images ",this.state);
			const fd = new FormData();

			fd.append('image',this.state.file, this.state.file.name);
			fd.set('url', this.state.uploadUrl)
			var config = { headers: { 'Content-Type': 'multipart/form-data' } };
			
			
			axios.post('http://me-do.cl/backend/upload',fd,config).then(res => {
				if(res['data'] == "File uploaded!"){
					this.setState({showConfirm:true});
					window.location.reload(); 

				}
				
			}).catch(function(error){
				this.setState({showError:true});
				console.log("ERROR",error);
				console.log("ERROR",error.response);
				console.log("ERROR",error.request);
			});
			
		}else{
			this.setState({showNotImage:true});

		}
		

	}

	hideAlert(){
		this.setState({showInvalid:false,showError:false,showConfirm:false,showNotImage :false});
	}
		

	render(){
		
		
			return(
				<div>
					
					<img 
						src={this.state.getUrl}
						alt="image" height={this.props.size} width={this.props.size} 
					/> 

					<form className="md-form">
						<div className="custom-file">
							<Row>
								<Col > 
									<label className="custom-file-label"> {this.state.name} </label>
									<input type="file" style={{'width': '200px'}} className="custom-file-input" id="validatedCustomFile" onChange={ this.handleChange} required/>
									
								</Col>
								<Col>   
									<Button  variant="dark" onClick={this.fileUploadHandler} >  <i className="fas fa-upload"></i> Actualizar  </Button>  
								</Col>
									
							</Row>
									
						</div>      
					</form>

                    {/* Sweet alert success changes  */}
                    <SweetAlert 
                        show={this.state.showConfirm} 
                        success 
                        title="Imagen guarda correctamente!" 
                        onConfirm={this.hideAlert} 
                        closeOnClickOutside={true}>
                    </SweetAlert>
                    {/* Sweet alert Error  */}
                    <SweetAlert 
                        show={this.state.showError } 
                        danger 
                        title="Ups!" 
                        onConfirm={this.hideAlert} 
                        closeOnClickOutside={true}>
							Parece que ha ocurrido un error intentando acceder al el servidor :(
                    </SweetAlert>
						
					<SweetAlert 
                        show={this.state.showInvalid } 
                        warning
                        title="Tipo de Archivo Invalido :(" 
                        onConfirm={this.hideAlert} 
                        closeOnClickOutside={true}>
							El tipo archivo debe ser ".png" o ".jpg".
                    </SweetAlert>

					<SweetAlert 
                        show={this.state.showNotImage } 
                        warning
                        title="No ha subido ninguna imagen."
                        onConfirm={this.hideAlert} 
                        closeOnClickOutside={true}>
                    </SweetAlert>

				</div>
			)
		}

		




}


export default Image;