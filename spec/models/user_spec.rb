require 'rails_helper'

RSpec.describe User, :type => :model do
  before do
    @user = User.new(:alias => 'kobe', :password => 'password', :password_confirmation => 'password')
  end

  it 'should be valid with alias, password, and password confirmation' do
    expect(@user).to be_valid
  end

  describe 'registration form with fields left blank' do
    it 'should be invalid without alias' do
      @user.alias = ' '
      expect(@user).to_not be_valid
    end

    it 'should be invalid without password' do
      @user.password = ' '
      expect(@user).to_not be_valid
    end

    it 'should be invalid without password confirmation' do
      @user.password_confirmation = ' '
      expect(@user).to_not be_valid
    end
  end

  describe "when email format is invalid" do
    it "should be invalid" do
      addresses = %w[kobe@foo,com kobe kobe.bryant@foo.
                     kobe@bryant_mamba.com kobe@swaggy+p.com]
      addresses.each do |invalid_address|
        @user.email = invalid_address
        expect(@user).not_to be_valid
      end
    end
  end

  describe "when email format is valid" do
    it "should be valid" do
      addresses = %w[kobe@foo.COM K_OB-E@b.m.org kobe.bryant@foo.ch]
      addresses.each do |valid_address|
        @user.email = valid_address
        expect(@user).to be_valid
      end
    end
  end

  describe 'when email address is already taken' do
    before do
      @user.email = 'kobe@bryant.com'
      @user.save
      @user2 = User.new(:alias => 'mamba', :password => 'password', :password_confirmation => 'password')
      @user2.email = 'KOBE@BRYANT.COM'
      @user2.save
    end

    it 'should not allow new user with same email' do
      expect(@user2).to_not be_valid
    end
  end

  describe 'with a password that is too short' do
    before do
      @user.password = @user.password_confirmation = 'xxxx'
    end

    it 'should not allow user to register' do
      expect(@user).to_not be_valid
    end
  end
end
