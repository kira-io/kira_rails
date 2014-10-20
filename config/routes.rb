Rails.application.routes.draw do
  resources :users
  resources :sessions, only: [:new, :create, :destroy]
  resources :entries, except: [:edit, :update]
  resources :posts, except: [:edit] do 
    resources :messages, except: [:edit, :update]
  end

  # posts
  get "/get_posts" => "posts#get_posts"
  post "/update_post" => "posts#update_post"
  get "/get_post" => "posts#get_post"
  # messages
  get "/get_messages" => "messages#get_messages"

  # user friendly routes
  get '/register' => 'users#new'
  get '/signin' => 'sessions#new'
  get '/signout' => 'sessions#destroy'
  root "sessions#new"
end
