import {
    FormContainer,
    FormH1,
    FormWrapper,
    FormH2
} from './Form/FormElements';

import {
    Form
} from './form';

import {
    useWallet
} from '../contexts/wallet';

export const Host = () => {
    const { connected } = useWallet();
    const form = connected ? <Form /> : <FormH2>connect wallet in order to host event</FormH2>
    const h1 = connected ? <FormH1>host an event</FormH1> : null;
    return (
        <div>
            <FormContainer id="Form">
                {h1}
                <FormWrapper>
                    {form}
                </FormWrapper>
            </FormContainer>
        </div>
    );
};

