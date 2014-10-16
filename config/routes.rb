Rails.application.routes.draw do
  resources :users
  resource :session, only: [:new, :create, :destroy]

  # user friendly routes
  get '/register' => 'users#new'
  get '/signin' => 'sessions#new'
  get '/signout' => 'sessions#destroy'
end
