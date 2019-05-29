import SideBar from './SideBar';
import React, {Component } from 'react';
import {Spinner, Breadcrumb ,Container,Card, ButtonGroup, Button, Row, Col, Modal } from 'react-bootstrap';
import axios from "axios";
import UpdateParams from './UpdateParams';
import CreateParams from './CreateParams';
import SweetAlert from "react-bootstrap-sweetalert";
import Image from './Image';
class CollectionsImages extends Component{

    componentDidMount(){
        // "http://me-do.cl/backend/api/texts/"
        console.log(this.state.collection_id);
        var paramsRequest  =   axios.get("http://localhost:3001/api/collections_images?filter[where][collection_id]=" + this.state.collectionsId);

        //then all request save results in state
        Promise.all([paramsRequest]).then((results) => {
            console.log(results);
            this.setState({collectionsImages:results[0]['data'].reverse(),load:false });
          })
          .catch(error => {
              console.log(error);
            return Promise.reject(error);
        });

    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            collectionsImages:[],
            forms:{"text_en":"Texto EN","text_es":"Texto ES","text_it":"Texto IT","order":"Orden"},
            params:{},
            load:true,
            target:0,
            collectionsId:this.props.match.params.collectionsId,
            collectionsSlug:this.props.match.params.collectionsSlug,
            showDelete:false,showError:false,showConfirm:false
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleShow2 = this.handleShow2.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleClose2 = this.handleClose2.bind(this);
        this.handleParams = this.handleParams.bind(this);

        this.delete = this.delete.bind(this);
        this.hideAlert= this.hideAlert.bind(this);
    }

    handleClose(){this.setState({ show: false });}
    handleShow(){this.setState({ show: true });}
    handleClose2(){this.setState({ show2: false });}
    handleShow2() {this.setState({ show2: true });}


    handleParams(){
        var t = this.state.target;
        this.setState({params:this.state.collectionsImages[t]});
        this.handleShow()
    }
    delete(){
        console.log("deleting!");
        var id = this.state.collectionsImages[this.state.target].id;
        axios.delete('http://localhost:3001/api/collections_images/'+ id.toString(), { data: {} }
        ).then(res => {
            console.log("result ",res);
            this.setState({showConfirm:true});
            window.location.reload(); 
        }) .catch(error => {
            console.log(error);
            this.setState({showError:true});
          return Promise.reject(error);
      });;
       
    }

    hideAlert(){
        this.setState({showDelete:false,showError:false,showConfirm:false});
    }
		

	
		render ()
		{
            if(this.state.load){
                return( <center> <h1>  <br/> <br/><br/> </h1> <Spinner style={{'width': '6rem','height': '6rem'}} animation="border" variant="primary" /> </center> )

            }else{

                var urlserver = "https://me-do.cl/";
                var listCollecion = this.state.collectionsImages.map((element,i) => {
                    return( 
                        <Col xs={12} md={6} lg={6}>
                            <Row>
                                <Col  xs={8} md={8} lg={8}>
                                    <Card>
                                        <Card.Header>{this.state.collectionsSlug + " "+  element.order.toString()} </Card.Header>
                                        <Card.Body>   
                                            <Image size={"200"} getUrl={urlserver   + element.file} uploadUrl={element.file }   />
                                        </Card.Body>
                                    </Card>
                                    <br/>
                                </Col  >
                            
                                <Col xs={4} md={4} lg={4}>
                                    <br/>
                                    <ButtonGroup vertical>
                                        <Button variant="outline-primary" 
                                                onClick={() => { 
                                                    this.setState({target:i},function() {this.handleParams()}  ) ; 
                                                }}
                                        
                                        > <i class="fas fa-edit"></i> Editar </Button>
                                        <Button variant="outline-danger"  
                                        onClick={() => { this.setState({target:i},function() {this.setState({showDelete:true})}  ) ;}}
                                                > <i class="fas fa-trash"></i>   Eliminar </Button>
                                    </ButtonGroup>
                                    <br/>  
                                </Col>
                            </Row>
                        </Col>
                     )
                });

                var required = [
                        {'name':'collection_id','parameter':this.state.collectionsId}
                    ]
                var urlTarget = "/media/images/collections/" + this.state.collectionsSlug + "/" + this.state.collectionsSlug;

                return(	<div className="wrapper">
                            <SideBar/>
                            <Container> 
                                <br/>
                                <Row >
                                    <Col  xs={8} md={8} lg={8}> 
                                        <Breadcrumb>
                                        <Breadcrumb.Item> Colleccion {this.state.collectionsSlug}  </Breadcrumb.Item>
                                        <Breadcrumb.Item active>  Imagenes </Breadcrumb.Item>
                                        </Breadcrumb>
                                    </Col> 
                                    <Col  xs={4} md={4} lg={4}>  
                                        <Button  onClick={this.handleShow2} variant="outline-success" size="lg"> <i class="fas fa-plus-circle "></i> Crear Parte </Button>
                                    </Col> 
                                </Row>
                                <Row>
                                    {listCollecion}
                                </Row>
                            </Container> 


                            {/* Modal edit collection  */}
                            <Modal  size="lg" show={this.state.show} onHide={this.handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title> Editar Collección </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <UpdateParams url="collections_images" required={required} params={this.state.params}  forms={this.state.forms} />
                                </Modal.Body>
                            
                            </Modal>

                            {/* Modal create collection  */}
                            <Modal  size="lg" show={this.state.show2} onHide={this.handleClose2}>
                                <Modal.Header closeButton>
                                    <Modal.Title> Crear una Parte de la Collección </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <CreateParams url="collections_images" targetImage={{"name":"order","url":urlTarget,paramsName:"file"}} required={required} check={['order']} name="Imagenes" image={true} forms={this.state.forms} />
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
                                Una vez borrado no podras recuperarlo.
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
                ); 
            }


			
		}

}


export default CollectionsImages;