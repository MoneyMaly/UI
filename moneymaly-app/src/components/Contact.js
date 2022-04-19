import React from 'react';
import Typography from '@material-ui/core/Typography';
import contactUs from '../images/contact_us.jpg';
import contactUsMobile from '../images/contact_us-mobile.jpg';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';

export default function Contact() {
    return (
        <div className={{ align: 'center' }}>
            <h2 className="center">Contact Us</h2>
            <Typography variant="h6">
                <p>If you need help, please visit our Help Center. There you'll find answers to many common questions about creating an account, watching your MoneyMaly and chat with companies. If you're unable to find what you're looking for in the Help Center, we suggest visiting our Community Help Forum. Experiencing a bug? Take a look at our Current Site Issues page to see a list of known issues we're working to fix.</p>
                <p>If you didn’t find a suitable answer in the listed pages above, please feel free to contact us directly right away:
                            Drop us a line at <a href="mailto:support@moneymaly.com">support@moneymaly.com</a><br /> Use the live chat inside the MoneyMaly app on your phone.</p>
                <img src={window.innerWidth >= 500 ? contactUs : contactUsMobile} alt="Contact Us, we are always listening" />
            </Typography>
            <h2 className="center">{" "}</h2>
            <Button
                type='button'
                onClick={() => alert('The email is unavailable.... Hhhhhh')}
                variant="contained"
                color="inherit"
                padding='3'
                endIcon={<SendIcon />}
            >Send email</Button>
            <h2 className="center">{" "}</h2>
        </div>
    );
}; 
