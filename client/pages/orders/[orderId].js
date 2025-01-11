import { useEffect, useState } from 'react';
import { publishableStripeKey } from './publishableStripeKey';
import StripeCheckout from 'react-stripe-checkout';

const OrderShow = ({order, currentUser}) => {
    const [timeLeft, setTimeLeft] = useState(0);
    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);
    if (timeLeft < 0) {
        return <div>Order expired</div>
    }

    const msLeft = new Date(order.expiresAt) - new Date();
    return <div>
        Time left to pay: {timeLeft}
        <StripeCheckout 
            token={(token) => console.log(token)} 
            stripeKey={publishableStripeKey} 
            amount={ order.ticket.price * 100 }
            email={ currentUser.email }
            />
        </div>;
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data };
}

export default OrderShow;