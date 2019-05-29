import SideBar from './SideBar';
import React, {Component } from 'react';
import {Spinner, Breadcrumb ,Container,Table, Button, Row,Form, Col } from 'react-bootstrap';
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
            show:false,
            showError:false,
            required:this.props.required
        };
        this.saveChanges = this.saveChanges.bind(this);
        this.hideAlert = this.hideAlert.bind(this);

        if(this.state.select){
            var targetName=this.state.targetName;
            var state = this.state;
            state.targetId = state.params[targetName];
        }
       
    }

    hideAlert(){
        this.setState({show:false,showError:false});
    }

    saveChanges(){
        var params = this.state.params;

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
        axios.patch('http://me-do.cl/backend/api/' + this.props.url, params).then(res => {
            console.log("result ",res);
            //alert("Cambios guardados correctamente");
            this.setState({show:true});
        }) .catch(error => {
            console.log(error);
            this.setState({showError:true});
          return Promise.reject(error);
      });
    }
        
        render (){
            var forms = this.state.forms;
            var keys= Object.keys(forms);
            var params = this.state.params;
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
                                defaultValue={params[element]}  />
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

            </Form>
            
            );         
    }
}


export default UpdateParams;