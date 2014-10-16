Rails.application.routes.draw do
  resources :users
  resources :sessions, only: [:new, :create, :destroy]
  resources :entries, except: [:edit, :update]
  resources :posts, except: [:edit, :update]
  resources :messages, except: [:edit, :update]

  # user friendly routes
  get '/register' => 'users#new'
  get '/signin' => 'sessions#new'
  get '/signout' => 'sessions#destroy'
  root "sessions#new"
end
