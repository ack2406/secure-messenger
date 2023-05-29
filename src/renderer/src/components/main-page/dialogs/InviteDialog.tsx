import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  HStack,
  Button,
  AlertDialogHeader,
  AlertDialogFooter
} from '@chakra-ui/react'
import { useRef } from 'react'
import { Socket } from 'socket.io-client'

interface InviteDialogProps {
  openAcceptDialog: boolean
  setOpenAcceptDialog: (open: boolean) => void
  acceptInvite: () => void
}

function InviteDialog({ openAcceptDialog, setOpenAcceptDialog, acceptInvite }: InviteDialogProps) {
  const cancelRef = useRef(null)
  const onClose = () => setOpenAcceptDialog(false)

  const onCloseAccept = () => {
    setOpenAcceptDialog(false)
    acceptInvite()
  }

  return (
    <AlertDialog isOpen={openAcceptDialog} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Accept invitation?
          </AlertDialogHeader>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={onCloseAccept} ml={3}>
              Accept
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default InviteDialog
