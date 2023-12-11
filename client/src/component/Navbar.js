import {Button, Container, Navbar, Modal} from 'react-bootstrap';
import { CartContext } from "../CartContext";
import CartProduct from './CartProduct';
import { useState, useRef, useContext } from 'react';
import { FaBars } from 'react-icons/fa';
import { links } from './data';

function NavbarComponent() {
    const cart = useContext(CartContext);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const checkout = async () => {
        await fetch('http://localhost:4000/checkout', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({items: cart.items})
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if(response.url) {
                window.location.assign(response.url); // Forwarding user to Stripe
            }
        });
    }

    const productsCount = cart.items.reduce((sum, product) => sum + product.quantity, 0);

    
    const [showLinks, setShowLinks] = useState(false);
    const linksContainerRef = useRef(null);
    const linksRef = useRef(null);
  
    const toggleLinks = () => {
      setShowLinks(!showLinks);
    };
    const linkStyles = {
      height: showLinks
        ? `${linksRef.current.getBoundingClientRect().height}px`
        : '0px',
    };

    return (
        <>
            <nav>
              <div className='nav-center'>
                <div className='nav-header'>
                  <button className='nav-toggle' onClick={toggleLinks}>
                    <FaBars />
                  </button>
                </div>
        
                <div
                  className='links-container'
                  ref={linksContainerRef}
                  style={linkStyles}
                >
                  <ul className='links' ref={linksRef}>
                    {links.map((link) => {
                      const { id, url, text } = link;
                      return (
                        <li key={id}>
                          <a href={url}>{text}</a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </nav>
            <Navbar expand="sm">
                <Navbar.Brand href="/">Store</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Button onClick={handleShow}>Cart ({productsCount} Items)</Button>
                </Navbar.Collapse>
            </Navbar>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Shopping Cart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {productsCount > 0 ?
                        <>
                            <p>Items in your cart:</p>
                            {cart.items.map( (currentProduct, idx) => (
                                <CartProduct key={idx} id={currentProduct.id} quantity={currentProduct.quantity}></CartProduct>
                            ))}

                            <h1>Total: {cart.getTotalCost().toFixed(2)}</h1>

                            <Button variant="success" onClick={checkout}>
                                Purchase items!
                            </Button>
                        </>
                    :
                        <h1>There are no items in your cart!</h1>
                    }
                </Modal.Body>
            </Modal>
        </>
    )
}

export default NavbarComponent;