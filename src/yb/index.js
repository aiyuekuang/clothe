/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, useEffect , useState,forwardRef } from 'react';
import PropTypes from "prop-types";




const Button = forwardRef((props,ref) => {
    const [count, setCount] = useState(0);

    const {} = props;

    useEffect(() => {

        return ()=>{
        }
    },[]);



    return (
        <div>

        </div>
    );
})

Button.propTypes = {
    /** Button label */
    children: PropTypes.node.isRequired,
    /** The color for the button */
    color: PropTypes.string,
    /** The size of the button */
    size: PropTypes.oneOf(['small', 'normal', 'large']),
    /** Disable button */
    disabled: PropTypes.bool,
    /** Gets called when the user clicks on the button */
    onClick: PropTypes.func,
};
Button.defaultProps = {
    color: '#333',
    size: 'normal',
    onClick: event => {
        // eslint-disable-next-line no-console
        console.log('You have clicked me!', event.target);
    },
};
export default Button;
