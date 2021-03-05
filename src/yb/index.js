/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, useEffect , useState,forwardRef } from 'react';
import PropTypes from "prop-types";




const Buttons = forwardRef((props,ref) => {
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

Buttons.propTypes = {
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
Buttons.defaultProps = {
    color: '#333',
    size: 'normal',
    onClick: event => {
        // eslint-disable-next-line no-console
        console.log('You have clicked me!', event.target);
    },
};
export default Buttons;
