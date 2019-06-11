import SideBar from './SideBar';
import React, {Component } from 'react';
import {Spinner, Breadcrumb ,Container,Card, ButtonGroup, Button, Row, Col, Modal } from 'react-bootstrap';
import axios from "axios";
import UpdateParams from './UpdateParams';
import CreateParams from './CreateParams';
import SweetAlert from "react-bootstrap-sweetalert";

class CollectionsParams extends Component{

    componentDidMount(){
        console.log(this.state.collection_id);
        var paramsRequest  =   axios.get("http://me-do.cl/backend/api/collections_parameters?filter[where][collection_id]=" + this.state.collectionsId);

        //then all request save results in state
        Promise.all([paramsRequest]).then((results) => {
            console.log(results);
            this.setState({collectionsParams:results[0]['data'].reverse(),load:false });
          })
          .catch(error => {
              console.log(error);
            return Promise.reject(error);
        });

    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            collectionsParams:[],
            forms:{"name_en":"Nombre EN","name_es":"Nombre ES","name_it":"Nombre IT", "shapediver_label":"Etiqueta Shapediver","shapediver_id":"Shapediver id"},
            params:{},
            load:true,
            target:0,
            collectionsId:this.props.match.params.collectionsId,
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
        this.setState({params:this.state.collectionsParams[t]});
        this.handleShow()
    }
    delete(){
        console.log("deleting!");
        var id = this.state.collectionsParams[this.state.target].id;
        axios.delete('http://me-do.cl/backend/api/collections_parameters/'+ id.toString(), { data: {} }
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

                var listCollecion = this.state.collectionsParams.map((element,i) => {
                    return( 
                        <Col xs={12} md={6} lg={6}>
                            <Row>
                                <Col  xs={6} md={6} lg={6}>
                                    <Card>
                                        <Card.Header>{element.slug} </Card.Header>
                                        <Card.Body>
                                                 {element.shapediver_label}
                                        </Card.Body>
                                    </Card>
                                    <br/>
                                </Col  >
                            
                                <Col xs={6} md={6} lg={6}>
                                    <br/>
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
                                    <br/>  
                                </Col>
                            </Row>
                        </Col>
                     )
                });

                return(	<div className="wrapper">
                            <SideBar  history={this.props.history}/>
                            <Container> 
                                <br/>
                                <Row >
                                    <Col  xs={8} md={8} lg={8}> 
                                        <Breadcrumb>
                                        <Breadcrumb.Item> Collecciones </Breadcrumb.Item>
                                        <Breadcrumb.Item active>  Parametros </Breadcrumb.Item>
                                        </Breadcrumb>
                                    </Col> 
                                    <Col  xs={4} md={4} lg={4}>  
                                        <Button  onClick={this.handleShow2} variant="outline-success" size="lg"> <i className="fas fa-plus-circle "></i> Crear Parametro </Button>
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
                                    <UpdateParams url="collections_parameters" params={this.state.params}  check={['shapediver_id','name_es','name_en','name_it']} forms={this.state.forms} />
                                </Modal.Body>
                            
                            </Modal>

                            {/* Modal create collection  */}
                            <Modal  size="lg" show={this.state.show2} onHide={this.handleClose2}>
                                <Modal.Header closeButton>
                                    <Modal.Title> Crear parametro de la Collección </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <CreateParams url="collections_parameters" required={[{'name':'collection_id','parameter':this.state.collectionsId}]} check={['shapediver_id','name_es','name_en','name_it']} name="Parametros" forms={this.state.forms} />
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


export default CollectionsParams;