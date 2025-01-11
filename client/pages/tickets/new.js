import { useState } from 'react';
import { useRequest } from '../../hooks/use-request';
import { router } from 'next/router';
const { doRequest, errors} = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
        title: price
    },
    onSuccess: (ticket) => {
        console.log(ticket);
        router.push("/");
    }
});

const NewTicket = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');

    const onBlur = () => {
        const value = parseFloat(price);
        if (isNaN(value)) {
            return;
        }

        setPrice(value.toFixed(2));
    };
    const onSubmit = (event) => {
        event.preventDefault();
        doRequest();
    };

    return (
        <div>
            <h1>Create at ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-control"/>
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input onBlur={onBlur} value={price} onChange={(e) => setTitle(e.target.value)} className="form-control"/>
                </div>
                {errors}
                <button className="btn btnPrimary">Submit</button>
            </form>
        </div>
    )
};

export default NewTicket;