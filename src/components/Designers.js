import React, {Component } from 'react';
import {Spinner, Breadcrumb ,Container,Table, Card, Button, ButtonGroup,Row, Col ,Modal} from 'react-bootstrap';
import axios from 'axios';
import SideBar from './SideBar';
import Image from './Image';
import CreateParams from './CreateParams';
import UpdateParams from './UpdateParams';
import SweetAlert from "react-bootstrap-sweetalert";

class Designers extends Component{
	componentDidMount(){	
		//var urlServer = "http://localhost:3001/";
        var urlServer = "http://me-do.cl/backend/";
		axios.get(urlServer + 'api/designers').then(res => {
			this.setState({designers:res.data.reverse(),load:false})
			console.log(res);
		}).catch(function(error){
			console.log("ERROR",error);
			console.log("ERROR",error.response);
			console.log("ERROR",error.request);
			this.setState({showError:true});
		});
		

	}

	constructor(props){
		super(props);
		this.state = {
			designers:[],
			load:true,
			show:false,
			show2:false,
			target:0,
			params:{},
			forms:{"name":"Nombre","alias":"alias","description_en":"descripción EN",
			"description_es":"descripción ES","description_it":"descripción IT","pais":"Pais","web":"Página web", "video":"Video"},
			showDelete:false,showError:false,showConfirm:false
		}

		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleShow2 = this.handleShow2.bind(this);
		this.handleClose2 = this.handleClose2.bind(this);
		this.handleParams = this.handleParams.bind(this);
		this.hideAlert = this.hideAlert.bind(this);
		this.delete = this.delete.bind(this);
	}

	handleClose() {
		this.setState({ show: false });
	}
	
	handleShow() {
	   this.setState({ show: true });
	}

	handleClose2() {
		this.setState({ show2: false });
	}
	
	handleShow2() {
	   this.setState({ show2: true });
	}

	handleParams() {
		var t = this.state.target;
		this.setState({params:this.state.designers[t]});
		this.handleShow()
	 }

	delete(){
		console.log("deleting!");

        var listRequest = [];
		var id = this.state.designers[this.state.target].id;
		//var urlServer = "http://localhost:3001/";
        var urlServer = "http://me-do.cl/backend/";
		
		var config = {'content-type': 'application/json'};
        listRequest.push(axios.delete(urlServer + "api/designers/"+ id.toString(), { data: {} }));
        listRequest.push(axios.post(urlServer+ "deleteFolder",{url: this.state.designers[this.state.target].image},config));
       
		Promise.all(listRequest).then((res) => {
            console.log("result ",res);
            this.setState({showConfirm:true});
            window.location.reload(); 

         }).catch(() => { console.log('failed!'); this.setState({showError:true}); });      
	  
	   
	}

	hideAlert(){
		this.setState({showDelete:false,showError:false,showConfirm:false});
	}
		

		

	render(){
		if(this.state.load){
			return( <center> <h1>  <br/> <br/><br/> </h1> <Spinner style={{'width': '6rem','height': '6rem'}} animation="border" variant="primary" /> </center> )

		}else{
			var listDesigners = this.state.designers.map((element,i) => {
				var params = element;
				//var urlserver = "http://localhost:8080";
			     var urlserver = "https://me-do.cl/";

				return( 
						<Col xs={12} md={6} lg={6}>
							<Row>
								<Col  xs={8} md={8} lg={8}>
									<Card>
										
										<Card.Header>{element.name} </Card.Header>
										<Card.Body>
											<Image size={"300"} getUrl={urlserver   + element.image} uploadUrl={element.image }   />
										</Card.Body>
									</Card>
									<br/>
								</Col  >
							
								<Col xs={4} md={4} lg={4}>
									<br/>   <br/>   
									<ButtonGroup vertical>
										<Button variant="outline-primary" 
												onClick={() => { 
													this.setState({target:i},function() {this.handleParams()}  ) ; 
												}}
										
										> <i className="fas fa-edit"></i> Editar </Button>
										  <Button variant="outline-danger"  
                                                         onClick={() => { this.setState({target:i},function() {this.setState({showDelete:true})}  ) ;}}
                                                    > <i className="fas fa-trash"></i>   Eliminar </Button>
									</ButtonGroup>
								</Col>
							</Row>
						</Col>
				)
			});

			return(
				<div className="wrapper">
                        <SideBar/>
                        <Container> 
						<br/>
                            <Row >
                                <Col  xs={8} md={8} lg={8}> 
                                    <Breadcrumb>
                                    <Breadcrumb.Item active> Diseñadores </Breadcrumb.Item>
                                    </Breadcrumb>
                                </Col> 
                                <Col  xs={4} md={4} lg={4}>  
                                    <Button  onClick={this.handleShow2} variant="outline-success" size="lg"> <i className="fas fa-plus-circle "></i> Crear Diseñador </Button>
                                </Col> 
                            </Row>
							<Row>
                                {listDesigners}
                            </Row>
						</Container>

						
                        <Modal  size="lg" show={this.state.show} onHide={this.handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title> Editar Diseñador </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <UpdateParams  url="designers" check={['name','web']} params={this.state.params} forms={this.state.forms}  />
                            </Modal.Body>
                           
                        </Modal>


						<Modal  size="lg" show={this.state.show2} onHide={this.handleClose2}>
                            <Modal.Header closeButton>
                                <Modal.Title> Crear Diseñador </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
								<CreateParams url="designers" check={['name','web']} targetImage={{name:"id",url:"static/imagenes/designers/",paramsName:"image"}} name="Diseñador" image={true} forms={this.state.forms} />
                            </Modal.Body>
                           
                        </Modal>

						 {/* Sweet alert confirm delete:  */}
                         <SweetAlert 
                            warning
                            showCancel
                            confirmBtnText="Si, borralo!"
                            confirmBtnBsStyle="danger"
                            cancelBtnBsStyle="default"
                            title="Estas seguro?"
                            onConfirm={this.delete}
                            onCancel={this.hideAlert}
                            show={this.state.showDelete}
                        >
                            Una vez borrado no podras recuperar la coleccion.
                        </SweetAlert>

                        {/* Sweet alert success changes  */}
                        <SweetAlert 
                            show={this.state.showConfirm} 
                            success 
                            title="Cambios guardados correctamente!" 
                            onConfirm={this.hideAlert} 
                            closeOnClickOutside={true}>
                        </SweetAlert>
                        {/* Sweet alert Error  */}
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


export default Designers;