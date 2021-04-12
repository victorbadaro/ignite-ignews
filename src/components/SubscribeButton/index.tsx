import { useSession, signIn } from 'next-auth/client';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceID: string;
}

export function SubscribeButton({ priceID }: SubscribeButtonProps) {
    const [session] = useSession();
    
    function handleSubscribe() {
        if(!session) {
            signIn('github');
            return;
        }

        
    }
    
    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    );
}