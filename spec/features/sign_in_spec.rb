require 'rails_helper'

RSpec.describe 'Signing in' do
  before do
    visit root_url
    @user = User.create(:alias => 'kobe', :password =>'password', :password_confirmation => 'password')
  end

  it 'prompts for an alias and password' do
    expect(page).to have_field('alias')
    expect(page).to have_field('password')
  end

  it 'signs in user if alias/password combination is valid' do
    fill_in 'alias', with: @user.alias
    fill_in 'password', with: @user.password
    click_button 'enter'
    expect(current_path).to eq(user_path(@user))
  end

  it 'does not sign in user if email/password combination is invalid' do
    fill_in 'alias', with: @user.alias
    fill_in 'password', with: 'wrongpassword'
    click_button 'enter'
    expect(page).to have_text('Invalid alias/password combination')
    expect(current_path).to eq(root_path)
  end
end
