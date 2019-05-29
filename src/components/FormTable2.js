import React, {Component } from 'react';
import {InputGroup ,FormControl,ButtonGroup,Container,Table, Button, Row, Col } from 'react-bootstrap';


class FormTable extends Component{



	render(){

		var data = this.props.data;
		var thread ={
			"key":"Llave",
			"text_en":"Español",
			"text_es":"Ingles",
			"text_it":"Italiano"
		};

		var keys= Object.keys(thread);


		// list of element in table
		const listTable = data.map((element,i) => {

			var listElement = keys.map((key) => {

				return(	<Col> 
						 
					 <InputGroup size="sm" className="mb-3">
					    <FormControl  aria-describedby="inputGroup-sizing-sm"  type="text" value={element[key]} />
					  </InputGroup>


						</Col>);
			})
			
			return(	<Row> {listElement} </Row> );

		});

		const listThread = keys.map((key) => {
			return(<Col> {thread[key]} </Col>)

		});

		return(
				
				<div>  


							    <Row>
							      {listThread }

							    </Row>
						 <br/> <br/>
							{listTable}

							<Row>
								<Col>
									<Button variant="danger"> Deshacer cambios </Button>
								</Col>
    							<Col>
    								<Button variant="success"> Guardar cambios </Button> 
    							</Col>
							</Row>


				</div>
		)



	}

}


export default FormTable;