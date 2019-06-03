import React, {Component } from 'react';
import {Spinner, Breadcrumb ,ListGroup,Modal,Container, ButtonGroup, Button, Row, Col, Card } from 'react-bootstrap';
import SideBar from './SideBar';
import axios from 'axios';
import UpdateParams from './UpdateParams';
import CreateParams from './CreateParams';
import SweetAlert from "react-bootstrap-sweetalert";

class Freq extends Component{


	componentDidMount(){

		// check if user logged in

       // var slidersRequest  =   axios.get('http://me-do.cl/backend/api/freq_questions');
       var categoryRequest  =  axios.get('http://me-do.cl/backend/api/freq_items'); 
       var itemsRequest     =  axios.get('http://me-do.cl/backend/api/freq_questions');
       
        //then all request save results in state
         Promise.all([categoryRequest,itemsRequest ]).then((results) => {
            console.log(results);
            this.setState({categories:results[0]['data'].reverse(),items:results[1]['data'].reverse(),load:false });
          })
          .catch(error => {
              console.log(error);
            return Promise.reject(error);
        });

	}

	constructor(props){
		super(props);
		this.state = {
            categories:[],
            items:[],
            load: true,
            handleClose:false,
            formsCategory:{"key":"Identificador","name_en":"Texto EN","name_es":"Texto ES","name_it":"Texto IT"},
            formsItems:{ "question_en":"Pregunta EN", "question_es":"Pregunta ES", "question_it":"Pregunta IT", "text_en":"Texto EN","text_es":"Texto ES","text_it":"Texto IT"},
            params:{}, paramsItem:{},
            target:0, targetItem:0,
            show:false, show2:false,show3:false, show4:false,
            showDelete:false,showError:false,showConfirm:false,showDelete2:false,
            required: [{'name':'freq_item_id','parameter':0}]
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleShow2 = this.handleShow2.bind(this);
        this.handleShow3 = this.handleShow3.bind(this);
        this.handleShow4 = this.handleShow4.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleParams = this.handleParams.bind(this);
        this.saveChanges = this.saveChanges.bind(this);

        this.delete = this.delete.bind(this);
        this.delete2 = this.delete2.bind(this);
        this.hideAlert= this.hideAlert.bind(this);
    }

    handleClose(){this.setState({ show: false, show2: false, show3: false, show4: false });}


    handleShow(){this.setState({ show: true });}
    handleShow2(){this.setState({ show2: true });}
    handleShow3(){this.setState({ show3: true });}
    handleShow4(){

        this.setState({ show4: true });
    }
    
    handleParams(){
        var t = this.state.target;
        this.setState({params:this.state.categories[t]});
        this.handleShow()
    }

    handleParams2(){
        var t = this.state.targetItem;
        this.setState({paramsItem:this.state.items[t]});
        this.handleShow3()
    }

    saveChanges(){
        this.handleClose();
    }


    delete(){
        console.log("deleting category");
        var id = this.state.categories[this.state.target].id;
        axios.delete('http://me-do.cl/backend/api/freq_items/'+ id.toString(), { data: {} }
        ).then(res => {
            console.log("result ",res);
            this.setState({showConfirm:true});
            window.location.reload(); 
        }) .catch(error => {
            console.log(error);
            this.setState({showError:true});
          return Promise.reject(error);
      });
    }

    delete2(){
        console.log("deleting questions");
        var id = this.state.items[this.state.targetItem].id;
        axios.delete('http://me-do.cl/backend/api/freq_questions/'+ id.toString(), { data: {} }
        ).then(res => {
            console.log("result ",res);
            this.setState({showConfirm:true});
            window.location.reload(); 
        }) .catch(error => {
            console.log(error);
            this.setState({showError:true});
          return Promise.reject(error);
      });
    }

    hideAlert(){
        this.setState({showDelete:false,showError:false,showConfirm:false});
    }

    render(){
		
		if(this.state.load){
			return( <center> <h1>  <br/> <br/><br/> </h1> <Spinner style={{'width': '6rem','height': '6rem'}} animation="border" variant="primary" /> </center> )

		}else{

            var dictionaryItems = {}
            var categories =  this.state.categories;
            var items = this.state.items;

            for(var i=0; i<categories.length ;i++){
                dictionaryItems[categories[i].id] = [];
            };
          
            for(var i=0; i<items.length ;i++){
                dictionaryItems[items[i].freq_item_id].push(items[i]);
            };

            var listCategories = categories.map((element,i) => {

                var params = element;
                //var urlserver = "http://localhost:8080";
                var urlserver = "https://me-do.cl/";
                var k=element.id.toString();
                var listItems = dictionaryItems[element.id].map((element,i) => {
                    return( 
                    <ListGroup.Item> 
                        <Row> 
                            <Col  xs={8} md={8} lg={8}> 
                                {element.question_en} 
                            </Col>

                            <Col xs={4} md={4} lg={4}> 
                                    <ButtonGroup>
                                        <Button variant="outline-primary" 
                                                onClick={() => { 
                                                    this.setState({targetItem:i},function() {this.handleParams2()}  ) ; 
                                                }}
                                        >   
                                            <i className="fas fa-edit"></i> Editar 
                                        </Button>

                                         <Button variant="outline-danger"  
                                                 onClick={() => { this.setState({targetItem:i},function() {this.setState({showDelete2:true})
                                                
                                                }  ) ;}}
                                        > 
                                            <i className="fas fa-trash"></i> Eliminar
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                        </Row>
                        
                    </ListGroup.Item>);
                });

                var required2 = [{'name':'freq_item_id','parameter':element.id}];


                return( 
                        <Col key={i} xs={12} md={12} lg={12}>
                            <Row>
                                <Col  xs={8} md={8} lg={8}>
                                   
                                    <div id={"accordion" + k } >
                                        <div class="card">
                                           
                                            <div class="card-header" id={"headingOne" + k}>
                                                <Row>
                                                    <Col  xs={2} md={2} lg={2}>   <button class="btn btn-dark" data-toggle="collapse" data-target={"#collapse" + k} aria-expanded="true" aria-controls="collapseOne">
                                                            <i className="fas fa-caret-down"> </i> 
                                                        </button> 
                                                    </Col>
                                                    <Col  xs={6} md={6} lg={6}>
                                                    <strong> {element.key} </strong>
                                                    </Col>
                                                    <Col  xs={4} md={4} lg={4}>  
                                                        <Button 
                                                            onClick={() => { 
                                                                this.setState({required:required2},function() {
                                                                    this.setState({show4:true});
                                                                });
                                                            }}
                                                            variant="outline-success" 
                                                        > 
                                                            <i className="fas fa-plus-circle "></i>  Crear Pregunta 
                                                        </Button>
                                                    </Col> 
                                                </Row>
                                                  
                                                   
                                                    
                                            </div>

                                            <div id={"collapse" + k } class="collapse" aria-labelledby={"heading" + k} data-parent={"#accordion" + k}>
                                                <div class="card-body">
                                                    <ListGroup>
                                                        {listItems}
                                                    </ListGroup>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                    <br/>
                                </Col  >
                            
                                <Col xs={4} md={4} lg={4}> 
                                    <ButtonGroup>
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

            return(	
                <div className="wrapper">
                    
                    <SideBar/>
                    <Container> 

                        <br/>
                        <Row >
                            <Col  xs={8} md={8} lg={8}> 
                                <Breadcrumb>
                                <Breadcrumb.Item active> Categorias </Breadcrumb.Item>
                                </Breadcrumb>
                            </Col> 
                            <Col  xs={4} md={4} lg={4}>  
                                <Button  onClick={this.handleShow2} variant="outline-success" size="lg"> <i className="fas fa-plus-circle "></i> Crear Categoria</Button>
                            </Col> 
                        </Row>
                        <Row>
                            {listCategories}
                        </Row>

                    </Container> 

                    {/* Modal edit category  */}
                    <Modal  size="lg" show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title> Editar Categoria </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <UpdateParams url="freq_items"  check={["key","name_en","name_es","name_it"]} params={this.state.params} forms={this.state.formsCategory} />
                        </Modal.Body>
                       
                    </Modal>

                    {/* Modal create category */}
                    <Modal  size="lg" show={this.state.show2} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title> Crear Categoría </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CreateParams url="freq_items" check={["key","name_en","name_es","name_it"]} name="Categoria Preguntas Frecuentes" forms={this.state.formsCategory} />
                        </Modal.Body> 
                       
                    </Modal>

                     {/* Modal edit item */}
                     <Modal  size="lg" show={this.state.show3} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title> Editar Pregunta </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <UpdateParams url="freq_questions" check={["question_en","question_es","question_it"]} params={this.state.paramsItem} forms={this.state.formsItems} />
                        </Modal.Body>
                       
                    </Modal>


                    {/* Modal create item */}
                    <Modal  size="lg" show={this.state.show4} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title> Crear Pregunta</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CreateParams url="freq_questions" required={this.state.required} check={["question_en","question_es","question_it"]} name="Pregunta" forms={this.state.formsItems} />
                        </Modal.Body> 
                       
                    </Modal>

                     {/* Sweet alert confirm delete category:  */}
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
                        Se borraran tanto la categoría como las preguntas asociadas. 
                    </SweetAlert>

                      {/* Sweet alert confirm delete question:  */}
                      <SweetAlert 
                        warning
                        showCancel
                        confirmBtnText="Si, borralo!"
                        confirmBtnBsStyle="danger"
                        cancelBtnBsStyle="default"
                        title="Estas seguro?"
                        onConfirm={this.delete2}
                        onCancel={this.hideAlert}
                        show={this.state.showDelete2}
                    >
                        Una vez eliminada la pregunta no podra recuperarla. 
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


export default Freq;