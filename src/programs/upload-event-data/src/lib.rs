use solana_program::{
    account_info::{AccountInfo,next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};
use std::mem;

// solana_program::declare_id!("ArEWv6QJUu9DABwfAt4v5EL5wnRGonEK4Zzfr496SQXV");

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    //store data for event
    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;
    if account.owner != program_id {
        msg!("Greeted account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }
    if account.try_data_len()? < mem::size_of::<u32>() {
        msg!("Greeted account data length too small for u32");
        return Err(ProgramError::InvalidAccountData);
    }
    let mut data = account.try_borrow_mut_data()?;
    for i in 0.._instruction_data.len() {
        if i < data.len() {
            data[i] = _instruction_data[i];
        }
    }
    Ok(())
}
