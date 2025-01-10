import mongoose from 'mongoose';

interface PaymentAttrs {
    id: string;
    stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
    id: string;
    stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema({
    stripeId: {
        type: String,
        required: true
    },
}, {
    toJSON: {
        transform(doc, ret) {
             ret.id = ret._id;
             delete ret._id;
        }
    }
});

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment({
        _id: attrs.id,
        stripeId: attrs.stripeId
    });
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);
export { Payment };