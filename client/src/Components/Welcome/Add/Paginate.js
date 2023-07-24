import React,{useRef} from "react";
import { Button } from "react-bootstrap";
import "./Paginate.css";
import { Form } from "react-bootstrap";

const Paginate = (props) => {
    const sizeRef=useRef(2);
    function firstPage() {
        props.onChangePage(1,sizeRef.current.value)
    }
    function lastPage() {
        props.onChangePage(props.data.lastPage,sizeRef.current.value)
    }
    function nextPage() {
        props.onChangePage(props.data.nextPage,sizeRef.current.value)
    }
    function previousPage() {
        props.onChangePage(props.data.previousPage,sizeRef.current.value)
    }
    function changeSize(e){
        props.onChangeSize(props.data.currentPage,e.target.value)
    }
  return (
    <div className="paginate">
      {props.data.previousPage > 1 && (
        <Button type="button" variant="light" onClick={firstPage}>
          <i class="fa-solid fa-angles-left"></i>     
        </Button>
      )}
      {props.data.currentPage !== 1 && (
        <Button type="button" variant="light" onClick={previousPage}>
          <i class="fa-solid fa-chevron-left"></i>
        </Button>
      )}
      <Button id='currentPage' variant="dark" >{props.data.currentPage}</Button>
      {props.data.nextPage <= props.data.lastPage && props.data.lastPage!==0&&(
        <Button type="button" variant="light" onClick={nextPage}>
          <i class="fa-solid fa-chevron-right"></i>
        </Button>
      )}
      {props.data.nextPage < props.data.lastPage && (
        <Button type="button" variant="light" onClick={lastPage}>
          <i class="fa-solid fa-angles-right"></i>
        </Button>
      )}
      <Form.Select defaultValue="2" className='selection' id='pageSize' onChange={changeSize} ref={sizeRef}>
          <option>2</option>
          <option>5</option>
          <option>10</option>
     </Form.Select>
    </div>
  );
};

export default Paginate;
