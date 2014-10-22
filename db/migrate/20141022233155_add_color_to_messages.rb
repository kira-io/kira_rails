class AddColorToMessages < ActiveRecord::Migration
  def change
    add_column :messages, :color, :string, :default => "p_green"
  end
end
