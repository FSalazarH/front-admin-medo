import React, {Component } from 'react';
import {Spinner, Button, Row,Form, Col } from 'react-bootstrap';
import axios from 'axios';
import SweetAlert from "react-bootstrap-sweetalert";
import moment from 'moment';
import 'moment/locale/es' 

class CreateParams extends Component{

    constructor(props) {
        super(props);
        this.state = {
            params:{},
            forms:this.props.forms,
            select: this.props.select,
            target: this.props.target,
            file:null,
            name:"",
            targetImage: this.props.targetImage,
            check: this.props.check,
            url: this.props.url,
            required: this.props.required,
            showError:false,showConfirm:false,showInvalid:false
        };
        this.saveChanges = this.saveChanges.bind(this);
        this.check = this.check.bind(this);
        this.hideAlert= this.hideAlert.bind(this);

        
        var keys= Object.keys(this.state.forms);
        var params = this.state.params;

        for(var j = 0; j < keys.length; j++) { 
            params[keys[j]] = "";
        }
        if(this.state.select){
            params[this.state.target] = this.state.select[0].id;
        }
        this.setState({ params: params});

    }

    check(){
        var checkList = this.state.check;
        var forms = this.state.forms;
        var params = this.state.params;
        for(var i=0;i<checkList.length;i++){
            var atribute = checkList[i];
            if(!params[atribute]){
                alert("El atributo " + forms[atribute] + " no puede estar vacio");
                return(false);
            }
        }

        return(true);
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
    
    saveChanges(){
        console.log(this.state);

        //Check params
        if(!this.check()){
            return;
        }

        var params = this.state.params;
        
        //If image in form
        if(this.state.targetImage){
            
            //params give name to folder and image
            var targetImage = this.state.targetImage;
            var name = params[targetImage.name];
            
            //Create folder just targetimage.folder
            if(this.state.targetImage.folder){
                axios.post('http://me-do.cl/backend/createFolder',{url: targetImage.url+name},config).then(res => {
                    console.log(res);
                    console.log("Carpeta creada");
                });    
            }
           
            //Create image
            const fd = new FormData();
			fd.append('image',this.state.file, this.state.file.name);
			fd.set('url', targetImage.url+name + '.png' )
			var config = { headers: { 'Content-Type': 'multipart/form-data' } };
			
			axios.post('http://me-do.cl/backend/upload',fd,config).then(res => {
				
				if(res['data'] == "File uploaded!"){
                    console.log("Imagen creada");
				}
            }); 
            
            params[targetImage.paramsName] = targetImage.url+name + '.png';
        }

         //If extra parameters required
        if(this.state.required){
            var requiredList = this.state.required;
            for(var i=0;i<requiredList.length;i++){
                var required = requiredList[i];
                params[required.name] = required.parameter;
            }
        }

        console.log("PARAMS: ",params);

        // create element in bd
        axios.post('http://me-do.cl/backend/api/' + this.state.url, params).then(res => {
            console.log("result ",res);
            this.setState({showConfirm:true});
            window.location.reload(); 
        }).catch(error => {
            console.log(error);
            this.setState({showError:true});
          return Promise.reject(error);
      });
    }

    hideAlert(){
        this.setState({showError:false,showConfirm:false,showInvalid:false});
    }
	
        
        render (){
            var forms = this.state.forms;
            var keys= Object.keys(forms);
            var params = this.state.params;
            var multiselect;
            var imageForm;

            var listForms = keys.map((element,i) => {
                return( 
                    <Form.Group as={Row} controlId="formPlaintextEmail">
                        <Form.Label column sm="2">
                            {forms[element]}
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control 
                                onChange = {(event) => {
                                    params[element] = event.target.value;
                                    this.setState({params:params});
                                }}  
                                 />
                        </Col>
                    </Form.Group>
                    
                    
              )
                
            })
            

            //If multiselect in forms:
            var select = this.state.select;
            
            if(select){
                var listSelect = select.map((element,i) => {
                    return(<option value={element.id}> {element.name} </option>)
                })
    
                multiselect = <Form.Group as={Row} controlId="select1">
                                    <Col sm="2">
                                        <Form.Label> Designers </Form.Label>
                                    </Col>
                                    <Col sm="10">
                                        <Form.Control 
                                            onChange={(event)=>{ 
                                                params[this.state.target] =event.target.value; 
                                                this.setState({params:params}); 
                                            }} 
                                            as="select" >
                                            {listSelect}
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
    
            }else{
                multiselect=null;
            }


            //If image in forms:
            if(this.state.targetImage){
                imageForm = <form className="md-form">
                                <Row>
                                    <Col sm="2">
                                        <label className="" for="customControlValidation1"> Imagen o fotografía: </label>
                                    </Col>
                                    <Col sm="10">
                                        <div className="custom-file">
                                                    <label className="custom-file-label" for="validatedCustomFile"> {this.state.name} </label>
                                                    <input type="file" className="custom-file-input" id="validatedCustomFile" onChange={ this.handleChange} required/>
                                                    <div className="invalid-feedback"> Archivo incorrecto </div>    
                                        </div> 
                                        <br/>      <br/>  
                                    </Col>
                                    
                                </Row>
                                  
                            </form>
            }else{
                imageForm=null;
            }

            return(	 
            <Form>  
                    {listForms}
                    {multiselect}
                    {imageForm}
                    <Button  className="pull-right" variant="success" onClick={this.saveChanges} > Crear {this.props.name} </Button>
           
                     {/* Sweet alert succes save changes */}
                     <SweetAlert 
                        show={this.state.showConfirm} 
                        success 
                        title="Cambios guardados correctamente!" 
                        onConfirm={this.hideAlert} 
                        closeOnClickOutside={true}>
                    </SweetAlert>

                    {/* Sweet alert error */}
                    <SweetAlert 
                        show={this.state.showError } 
                        danger 
                        title="A ocurrido un error :(" 
                        onConfirm={this.hideAlert} 
                        closeOnClickOutside={true}>
                    </SweetAlert>

                    <SweetAlert 
                        show={this.state.showInvalid } 
                        warning
                        title="Tipo de Archivo Invalido !" 
                        onConfirm={this.hideAlert} 
                        closeOnClickOutside={true}>
							El tipo archivo debe ser ".png" o ".jpg".
                    </SweetAlert>
            </Form>
            
            );         
    }
}


export default CreateParams;