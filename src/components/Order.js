import React, {Component } from 'react';
import {Spinner, Breadcrumb ,Container,Table, Button, Row, Col, Badge } from 'react-bootstrap';
import SideBar from './SideBar';


class Order extends Component{


	componentDidMount(){
		// "http://me-do.cl/backend/api/texts/"
		// GEt ordenes de compra
	}

	constructor(props){
		super(props);
		this.state = {
			data:{},
			load: false
		}
	}

	render(){
		
		if(this.state.load){
			return( <center> <h1>  <br/> <br/><br/> </h1> <Spinner style={{'width': '6rem','height': '6rem'}} animation="border" variant="primary" /> </center> )

		}else{
            var data = [{'id':45,'name':'Juan Andres','date':'26 Mayo 2019','state':'Complete','total':'$18.900','file':'/archivo.zip'},
                        {'id':48,'name':'Fabricio Silva','date':'25 Mayo 2019','state':'Error','total':'$18.900','file':'/archivo.zip'},
                        {'id':90,'name':'Federico Errazuriz','date':'24 Mayo 2019','state':'Complete','total':'$18.900','file':'/archivo.zip'}
            ];
            var forms = {'id':'Numero de pedido','name':'Nombre pedido','date':'Fecha','state':'Estado','total':'Total','file':'Archivo'};
            var keys= Object.keys(forms);

            const listTable = data.map((element,i) => {
                var listElement = keys.map((key,j) => {
                    if(key=='state'){
                        if(element[key]=='Complete'){
                            return(<td>   <Badge variant="success">  Completada </Badge> </td> )
                        }else if(element[key]=='Error'){
                            return(<td>   <Badge variant="danger">  Fallida </Badge> </td> )
                        }
                    }else if(key=='file'){
                        return(  <td>   
                                    <Button variant="secondary"> <i className="fas fa-file-archive "></i>    </Button>  
                                    
                        
                                </td>  )
                    }else{
                        return(<td> {element[key]} </td> )
                    }
                    
                });
                return( 
                    <tr> {listElement} </tr>
                )
            });

            var listThread = keys.map((element,i)=> {
                return(<th> {forms[element]} </th>)
            })

			return(
				<div className="wrapper">
					
					<SideBar/>
					<Container> 

						<br/>
						<Breadcrumb>
						<Breadcrumb.Item active> Ordenes de Compra </Breadcrumb.Item>
						</Breadcrumb>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    {listThread}
                                </tr>
                            </thead>
                            <tbody>
                                {listTable}
                            </tbody>
                        </Table>
						
						<br/><br/> 

					</Container>
				</div>

			)
		}

		



	}

}


export default Order;