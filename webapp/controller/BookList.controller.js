sap.ui.define(
	[
		'sap/ui/core/mvc/Controller',
		'sap/ui/core/Fragment',
		'sap/m/MessageToast',
		'../model/formatter'
	],
	(Controller, Fragment, MessageToast, formatter) => {
		'use strict'

		return Controller.extend('library.controller.BookList', {
			formatter,
			onAddBookDialog() {
				if (!this.addDialog) {
					this.addDialog = Fragment.load({
						id: this.getView().getId(),
						name: 'library.view.AddBookDialog',
						controller: this
					}).then(oDialog => {
						this.getView().addDependent(oDialog)
						return oDialog
					})
				}

				this.addDialog.then(oDialog => oDialog.open())
			},
			onCloseDialog() {
				this.byId('addBookDialog').close()
			},
			onSaveBook() {
				const isbn = this.byId('isbn').mProperties.value
				const title = this.byId('title').mProperties.value
				const author = this.byId('author').mProperties.value
				const publishedOn = this.byId('publishedOn').mProperties.value
				const language = this.byId('language').mProperties.value
				const nrBooks = this.byId('nrBooks').mProperties.value
				const availableBooks = this.byId('availableBooks').mProperties.value

				this.getOwnerComponent()
					.getModel()
					.create(
						'/BooksSet',
						{
							BooksId: String(isbn),
							Author: author,
							Title: title,
							Language: language,
							NrAvailable: Number(availableBooks),
							DatePublished: publishedOn,
							NrBooks: Number(nrBooks)
						},
						{
							success: () => {
								MessageToast.show(
									this.getView()
										.getModel('i18n')
										.getResourceBundle()
										.getText('bookCreatedSuccessfully')
								)
								this.byId('addBookDialog').close()
							},
							error: error => {
								MessageToast.show(
									this.getView()
										.getModel('i18n')
										.getResourceBundle()
										.getText('bookCreatedUnSuccessfully')
								)
								console.log(error)
								this.byId('addBookDialog').close()
							}
						}
					)
			},
			onDeleteBook() {
				this.getView()
					.getModel()
					.remove(this.byId('idBooksTable').getSelectedContexts()[0].getPath(), {
						success: () =>
							MessageToast.show(
								this.getView()
									.getModel('i18n')
									.getResourceBundle()
									.getText('bookDeletedSuccessfully')
							),
						error: () =>
							MessageToast.show(
								this.getView()
									.getModel('i18n')
									.getResourceBundle()
									.getText('bookDeletedUnSuccessfully')
							)
					})
			},
			onUpdateBook() {
				if (!this.byId('idBooksTable').getSelectedItem()) {
					MessageToast.show('Select a book first')
					return
				}

				if (!this.editDialog) {
					this.editDialog = Fragment.load({
						id: this.getView().getId(),
						name: 'library.view.EditBookDialog',
						controller: this
					}).then(oDialog => {
						this.getView().addDependent(oDialog)
						return oDialog
					})
				}

				this.editDialog.then(oDialog => {
					oDialog.open()

					const { cells } = this.byId('idBooksTable').getSelectedItem().mAggregations

					this.byId('isbnEdit').setValue(cells[0].mProperties.text)
					this.byId('titleEdit').setValue(cells[1].mProperties.text)
					this.byId('authorEdit').setValue(cells[2].mProperties.text)
					this.byId('publishedOnEdit').setValue(cells[3].mProperties.text)
					this.byId('languageEdit').setValue(cells[4].mProperties.text)
					this.byId('nrBooksEdit').setValue(cells[5].mProperties.text)
					this.byId('availableBooksEdit').setValue(cells[6].mProperties.text)
				})
			},
			onCloseEditDialog() {
				this.byId('editBookDialog').close()
			},
			onModifyBook() {
				const isbn = this.byId('isbnEdit').mProperties.value
				const title = this.byId('titleEdit').mProperties.value
				const author = this.byId('authorEdit').mProperties.value
				const publishedOn = this.byId('publishedOnEdit').mProperties.value
				const language = this.byId('languageEdit').mProperties.value
				const nrBooks = this.byId('nrBooksEdit').mProperties.value
				const availableBooks = this.byId('availableBooksEdit').mProperties.value

				this.getOwnerComponent()
					.getModel()
					.update(
						`/BooksSet('${isbn}')`,
						{
							BooksId: String(isbn),
							Author: author,
							Title: title,
							Language: language,
							NrAvailable: Number(availableBooks),
							DatePublished: publishedOn,
							NrBooks: Number(nrBooks)
						},
						{
							method: 'PUT',
							success: () => {
								MessageToast.show(
									this.getView()
										.getModel('i18n')
										.getResourceBundle()
										.getText('bookModifiedSuccessfully')
								)
								this.byId('editBookDialog').close()
							},
							error: () => {
								MessageToast.show(
									this.getView()
										.getModel('i18n')
										.getResourceBundle()
										.getText('bookModifiedUnSuccessfully')
								)
								this.byId('editBookDialog').close()
							}
						}
					)
			}
		})
	}
)
