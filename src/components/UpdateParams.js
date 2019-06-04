import SideBar from './SideBar';
import React, {Component } from 'react';
import {Checkbox, Button, Row,Form, Col } from 'react-bootstrap';
import axios from 'axios';
import SweetAlert from "react-bootstrap-sweetalert";

class UpdateParams extends Component{

    constructor(props) {
        super(props);
        this.state = {
            params:this.props.params,
            forms:this.props.forms,
            select: this.props.select,
            targetName:this.props.target,
            targetId:0,
            show:false, showError:false,showCheck:false,
            checkParameter:"",
            check:this.props.check,
            required:this.props.required,
            active:false,home:false
        };
        this.saveChanges = this.saveChanges.bind(this);
        this.hideAlert = this.hideAlert.bind(this);

        if(this.state.select){
            var targetName=this.state.targetName;
            var state = this.state;
            state.targetId = state.params[targetName];
        }

        if(this.state.params['active'] != undefined){
            var state=this.state;
            if(this.state.params.active == 1){
                state.active = true;
            }
            if(this.state.params.home == 1){
                state.home = true;
            }
        }


       
    }

    hideAlert(){
        this.setState({show:false,showError:false,showCheck:false});
    }

    
    saveChanges(){
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


        console.log(params);

        
        //Check params
        if(!this.check()){
            return;
        }

        //If select set parameters
        if(this.state.select){
            console.log(this.state.targetName,this.state.targetId);
            params[this.state.targetName] = this.state.targetId;
        }


        //If extra parameters required
        if(this.state.required){
            var requiredList = this.state.required;
            for(var i=0;i<requiredList.length;i++){
                var required = requiredList[i];
                params[required.name] = required.parameter;
            }
        }

        console.log("params ",params);
        console.log('URL: http://me-do.cl/backend/api/' + this.props.url);
        
        axios.patch('http://me-do.cl/backend/api/' + this.props.url, params).then(res => {
            console.log("result ",res);
            //alert("Cambios guardados correctamente");
            this.setState({show:true});
        }).catch(function(error){
            console.log("ERROR ",error);
            console.log("ERROR resp ",error.response);
            console.log("ERROR request ",error.request);
            this.setState({showError:true});
        });
      
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
        
    render (){
            var forms = this.state.forms;
            var keys= Object.keys(forms);
            var params = this.state.params;
            var listForms = keys.map((element,i) => {
                
                var formText;
                if(element.indexOf("description") != -1 ||  element.indexOf("text") != -1){
                    formText =  <Form.Control as="textarea" rows="2"
                                    onChange = {(event) => {
                                        params[element] = event.target.value;
                                        this.setState({params:params});

                                    }}  
                                    defaultValue={params[element]}  />
                                 
                }else if(element == 'active'){
                    formText =   
                            <div 
                                key={element}  
                                onChange = {(event) => {this.setState({active:!this.state.active});}}      
                                className="mb-3">
                                    <Form.Check 
                                        checked={this.state.active}
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
                                checked={this.state.home}
                            />
                     </div>
                }else{
                    formText =  <Form.Control 
                                    onChange = {(event) => {
                                        params[element] = event.target.value;
                                        this.setState({params:params});

                                    }}  
                                    defaultValue={params[element]}  />
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
            var select = this.state.select;
            var multiselect;
            if(select){
                var id = this.state.targetId;
                var listSelect = select.map((element,i) => {
                   return(<option value={element.id.toString()}>  {element.name} </option>)                   
                })
                multiselect=<Form.Group as={Row} controlId="select1">
                                <Col sm="2">
                                    <Form.Label> Designers </Form.Label>
                                </Col>
                                <Col sm="10">
                                    <Form.Control as="select" onChange={(event)=>{this.setState({targetId:event.target.value});} } value={id.toString()}>
                                        {listSelect}
                                    </Form.Control>
                                </Col>
                            </Form.Group>
            }else{
                multiselect=null;
            }

            

            return(	 
            <Form>  
                    {listForms}
                    {multiselect}
                    <Button  className="pull-right" image={true} variant="success" onClick={this.saveChanges} > Guardar cambios </Button>
                    
                     {/* Sweet alert succes save changes */}
                    <SweetAlert 
                        show={this.state.show} 
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

                    {/* Sweet check */}
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


export default UpdateParams;