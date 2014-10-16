class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.string :title
      t.text :content
      t.string :location
      t.references :user, index: true

      t.timestamps
    end
  end
end
