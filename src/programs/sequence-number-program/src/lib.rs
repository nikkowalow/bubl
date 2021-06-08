use byteorder::{ByteOrder, LittleEndian};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};
use std::mem;

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey, 
    accounts: &[AccountInfo],
    _instruction_data: &[u8], 
) -> ProgramResult {
    msg!("sequence incrementation program");
    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;
    if account.owner != program_id {
        msg!("sequence account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }
    if account.try_data_len()? < mem::size_of::<u32>() {
        msg!("sequence account data length too small for u32");
        return Err(ProgramError::InvalidAccountData);
    }
    let mut data = account.try_borrow_mut_data()?;
    let mut num_greets = LittleEndian::read_u32(&data);
    num_greets += 1;
    LittleEndian::write_u32(&mut data[0..], num_greets);

    msg!("sequence incremented");
    Ok(())
}

// Sanity tests
#[cfg(test)]
mod test {
    use super::*;
    use solana_program::clock::Epoch;

    #[test]
    fn test_sanity() {
        let program_id = Pubkey::default();
        let key = Pubkey::default();
        let mut lamports = 0;
        let mut data = vec![0; mem::size_of::<u32>()];
        LittleEndian::write_u32(&mut data, 0);
        let owner = Pubkey::default();
        let account = AccountInfo::new(
            &key,
            false,
            true,
            &mut lamports,
            &mut data,
            &owner,
            false,
            Epoch::default(),
        );
        let instruction_data: Vec<u8> = Vec::new();

        let accounts = vec![account];

        assert_eq!(LittleEndian::read_u32(&accounts[0].data.borrow()), 0);
        process_instruction(&program_id, &accounts, &instruction_data).unwrap();
        assert_eq!(LittleEndian::read_u32(&accounts[0].data.borrow()), 1);
        process_instruction(&program_id, &accounts, &instruction_data).unwrap();
        assert_eq!(LittleEndian::read_u32(&accounts[0].data.borrow()), 2);
    }
}
