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
            showError:false,showConfirm:false,showInvalid:false,showCheck:false,
            checkParameter:"",
            active:false,home:false
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
                this.setState({checkParameter:forms[atribute],showCheck:true});
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

        if(params['active'] != undefined){
            if(this.state.active){
                params['active']=1;
            }else{
                params['active']=0;
            }
            if(this.state.home){
                params['home']=1;
            }else{
                params['home']=0;
            }
        }


        var urlTarget;

        // if image add params temporal url
        if(this.state.targetImage){
            var targetImage = this.state.targetImage;
             urlTarget = targetImage.url;
             params[targetImage.paramsName] = urlTarget;
        }


        
        //If extra parameters required
        if(this.state.required){
            var requiredList = this.state.required;
            for(var i=0;i<requiredList.length;i++){
                var required = requiredList[i];
                params[required.name] = required.parameter;
            }
        }

        console.log("Creating params: ",params);        
        
        // create element in bd
        //var urlServer = "http://me-do.cl/backend/";
        var urlServer = "http://localhost:3001/";

        console.log(urlServer  + this.state.url);

        axios.post(urlServer  + "api/"+ this.state.url, params).then(res => {
            console.log("result ",res);

            var name = res.data.id.toString()
            params['id'] = res.data.id;

            var urlpath = urlTarget + name

            if(this.state.targetImage){  
                params[this.state.targetImage.paramsName] = urlpath + ".png";
            }
            
            //updateing url with id
            var listRequest = [axios.patch(urlServer  + "api/"+ this.state.url, params)]; 

            console.log(urlpath);

            //If image in form
            if(this.state.targetImage){
                
                console.log("target image before update",urlpath);


                //Create image
                const fd = new FormData();
                fd.append('image',this.state.file, this.state.file.name);
                fd.set('url', params[this.state.targetImage.paramsName] );
                var config = { headers: { 'Content-Type': 'multipart/form-data' } };
                
                console.log(params[this.state.targetImage.paramsName]);
                listRequest.push(axios.post(urlServer + "upload",fd,config));

                //Create folder just targetimage.folder
                if(this.state.targetImage.folder){
                    config = {'content-type': 'application/json'};
                    listRequest.push(axios.post( urlServer + "createFolder",{url:urlpath},config));
                }

                
            }

            console.log(listRequest);

            
            //then all request save results in state
            Promise.all(listRequest).then((results) => {
                console.log(results);
                this.setState({showConfirm:true});
                window.location.reload(); 
             }).catch(function(error){
				this.setState({showError:true});
				console.log("ERROR",error);
				console.log("ERROR resp",error.response);
				console.log("ERROR request",error.request);
			});

            

           


        }).catch(function(error){
            console.log("ERROR 1 ",error);
            console.log("ERROR 1",error.response);
            console.log("ERROR 1",error.request);
        });
      
    }

    hideAlert(){
        this.setState({showError:false,showConfirm:false,showInvalid:false,showCheck:false});
    }
	
        
        render (){
            var forms = this.state.forms;
            var keys= Object.keys(forms);
            var params = this.state.params;
            var multiselect;
            var imageForm;

            var listForms = keys.map((element,i) => {
                var formText;
                if(element.indexOf("description") != -1 ||  element.indexOf("text") != -1){
                    formText =  <Form.Control  as="textarea" rows="2"
                    onChange = {(event) => {
                        params[element] = event.target.value;
                        this.setState({params:params});
                    }}  
                    />
                }else if(element == 'active'){
                    formText =   
                            <div 
                                key={element}  
                                onChange = {(event) => {this.setState({active:!this.state.active});}}      
                                className="mb-3">
                                    <Form.Check 
                                        type={'checkbox'}
                                        id={element}
                                        label={ forms[element]}
                                    />
                             </div>
                                                

                }else if(element == 'home'){
                    formText =   
                    <div 
                        key={element}  
                        onChange = {(event) => {this.setState({home:!this.state.home});}}    
                        className="mb-3">
                            <Form.Check 
                                type={'checkbox'}
                                id={element}
                                label={ forms[element]}
                            />
                     </div>
                }else{
                    formText =  <Form.Control 
                    onChange = {(event) => {
                        params[element] = event.target.value;
                        this.setState({params:params});
                    }}  
                    />
                }
                return( 
                    <Form.Group as={Row} controlId="formPlaintextEmail">
                        <Form.Label column sm="2">
                            {forms[element]}
                        </Form.Label>
                        <Col sm="10">
                           {formText}
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
                                        <br/> <br/>  
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
                    <SweetAlert 
                        show={this.state.showCheck } 
                        warning
                        title="" 
                        onConfirm={this.hideAlert} 
                        closeOnClickOutside={true}>
							El atributo "{this.state.checkParameter}"" no puede estar vacio
                    </SweetAlert>
            </Form>
            
            );         
    }
}


export default CreateParams;