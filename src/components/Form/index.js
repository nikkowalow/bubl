import solanalogo from '../../images/solanalogo.png';

import {
    FormContainer,
    FormH1,
    FormWrapper,
    FormShape,
    FormIcon,
    FormH2,
    FormP
} from './FormElements';

const Form = () => {
    return (
        <FormContainer id="Form">
            <FormH1>Our Cards</FormH1>
            <FormWrapper>
                <FormShape>
                    <FormIcon src={solanalogo} />
                    <FormH2>first card</FormH2>
                    <FormP>
                        lorem ipsm asdfjasdkf asoif jasdfj as dfai
                    </FormP>
                </FormShape>
                <FormShape>
                    <FormIcon src={solanalogo} />
                    <FormH2>second card</FormH2>
                    <FormP>
                        lorem ipsm asdfu2344934uc 2sazfjaskdfjaskdfjasld
                    </FormP>
                </FormShape>
                <FormShape>
                    <FormIcon src={solanalogo} />
                    <FormH2>third Expenses</FormH2>
                    <FormP>
                        lorem ipssaddf ai34 0340 t034t0-34 kt 03 0t4k3askdfjasld
                    </FormP>
                </FormShape>
            </FormWrapper>
        </FormContainer>
    )
}

export default Form;
