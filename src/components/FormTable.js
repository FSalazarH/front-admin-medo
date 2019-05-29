import React, {Component } from 'react';
import {InputGroup ,FormControl,ButtonGroup,Container,Table, Button, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/es' 

class FormTable extends Component{

	constructor(props){
		super(props);
		this.state = {
			data:this.props.data,
			changes:{},
			load:false
		}

		this.saveChanges = this.saveChanges.bind(this);
	}

	 saveChanges() {
	 	var changes = this.state.changes;
	 	var keyss= Object.keys(changes);
	 	var promised = [];
	 	for (var i = 0; i < keyss.length; i++) {
	 		changes[keyss[i]]['updated'] = moment().format();    
	 		console.log("HERE",changes,keyss[i]);
	 		var call = fetch("http://me-do.cl/backend/api/texts",
			    			{
			    				method:'PUT',
								dataType: 'json',
								headers:{
									'Access-Control-Allow-Methods':'*',
								    'Content-Type': 'application/json'
									},
								body: JSON.stringify(changes[keyss[i]])
									}
						).then(response => response.json())
						 .then(parsedJson => {
							if(parsedJson['error'] ){
								//this.props.history.push('/');
								console.log("parsedJson> ",parsedJson);
							}else{
								console.log("success update ",changes)
							}
						});


		   promised.push(call);
		
	  	}

	  	
		Promise.all(promised).then((results) => {
			alert("datos actualizados correctamente");
		});
	}

	    

	render(){

		var data = this.state.data;
		var thread ={
			"text_en":"Ingles",
			"text_es":"Español",
			"text_it":"Italiano"
		};

		var keys= Object.keys(thread);
		var changes = this.state.changes;


		// list of element in table
		const listTable = data.map((element,i) => {

			var listElement = keys.map((key) => {

				return(	<td> 
					   <div className="form-group">
						    <input defaultValue={element[key]} onChange = {(event) => {
					    		element[key] = event.target.value;
					    		changes[ element['id']] = element;
					    		this.setState({changes:changes });

					    	}} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter text" />
						  </div>

					</td>);
			})
			
			return(	<tr> {listElement} </tr> );

		});

		const listThread = keys.map((key) => {
			return(<th> {thread[key]} </th>)

		});

		return(
				
				<div>  

						<Table style={{'height':'600px','display':'block','overflow': 'auto','position': 'relative'}} bordered responsive >
							  <thead className="thead-dark">
							    <tr>
							      {listThread }
							    </tr>
							  </thead>

							  <tbody   >
							    {listTable}
							  </tbody>
						</Table>

							<Row>
								<Col>
									<Button  variant="danger"> Deshacer cambios </Button>
								</Col>
    							<Col>
    								<Button onClick={this.saveChanges} variant="success"> Guardar cambios </Button> 
    							</Col>
							</Row>


				</div>
		)



	}

}


export default FormTable;