require 'rails_helper'

RSpec.describe UsersController, :type => :controller do
  before do
    @user = User.create(:alias => 'kobe', :password => 'password', :password_confirmation => 'password')
  end

  context 'when not signed in' do
    before do
      session[:user_id] = nil
    end

    it 'cannot access index' do
      get :index
      expect(response).to redirect_to(root_url)
    end

    it 'cannot access show' do
      get :show, id: @user
      expect(response).to redirect_to(root_url)
    end

    it 'cannot access edit' do
      get :edit, id: @user
      expect(response).to redirect_to(root_url)
    end

    it 'cannot access update' do
      get :update, id: @user
      expect(response).to redirect_to(root_url)
    end

    it 'cannot access destroy' do
      delete :destroy, id: @user
      expect(response).to redirect_to(root_url)
    end
  end

  context 'when signed in as the wrong user' do
    before do
      @wrong_user = User.create(:alias => 'james', :password => 'password', :password_confirmation => 'password')
      session[:user_id] = @wrong_user
    end

    it 'cannot edit another user' do
      get :edit, id: @user
      expect(response).to redirect_to(@wrong_user)
    end

    it 'cannot update another user' do
      patch :update, id: @user
      expect(response).to redirect_to(@wrong_user)
    end

    it 'cannot access another user\'s show page' do
      get :show, id: @user
      expect(response).to redirect_to(@wrong_user)
    end

    it 'cannot destroy another user' do
      delete :destroy, id: @user
      expect(response).to redirect_to(@wrong_user)
    end
  end
end
